<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\TaskRepository;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\User;
use App\Repository\TableRepository;
use App\Repository\SubtaskRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Task;
use App\Entity\Subtask;
use App\Entity\Comment;
use App\Repository\CommentRepository;
use App\Repository\UserRepository;

final class TaskController extends AbstractController
{

    public function __construct(private TaskRepository $taskRepository, private TableRepository $tableRepository, private SubtaskRepository $subtaskRepository, private CommentRepository $commentRepository, private UserRepository $userRepository) {}

    //Obtain a task with its subtasks
    #[Route('/api/task/{id}', name: 'getTask', methods: ['GET'])]
    public function index(int $id): JsonResponse
    {
        $task = $this->taskRepository->findOneBy(['id' => $id]);

        if (empty($task)) {
            return new JsonResponse(['message' => 'Task not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $table = $task->getTableId();
        $members = [];

        foreach ($table->getMembers() as $member) {
            $members[] = [
                'id' => $member->getUser()->getId(),
                'email' => $member->getUser()->getEmail(),
            ];
        }

        $data = [
            'id' => $task->getId(),
            'title' => $task->getTitle(),
            'description' => $task->getDescription(),
            'status' => $task->getStatus(),
            'created_at' => $task->getCreatedAt(),
            'priority' => $task->getPriority(),
            'due_at' => $task->getDueAt(),
            'table_id' => $table->getId(),
            'asigned_to' => $task->getAssigneeId() ? $task->getAssigneeId()->getEmail() : null,
            'members' => $members,
        ];

        return new JsonResponse($data, JsonResponse::HTTP_OK);
    }

    //Create a task
    #[Route('/api/newTask', name: 'addTask', methods: ['POST'])]
    public function addTask(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        $table = $this->tableRepository->findOneBy(['id' => $data['table_id']]);
        if (empty($table)) {
            return new JsonResponse(['error' => 'Table not found'], JsonResponse::HTTP_NOT_FOUND);
        }
        $task = new Task();
        $task->setTableId($table);
        $task->setTitle($data['title']);
        $task->setDescription($data['description'] ?? '');
        $task->setStatus('todo');
        $task->setPriority($data['priority'] ?? '');
        $task->setCreatedAt(new \DateTimeImmutable());
        $task->setDueAt($data['due_at'] ?? '');
        $entityManager->persist($task);
        $entityManager->flush();
        return new JsonResponse(['message' => 'Task created'], JsonResponse::HTTP_CREATED);
    }


    //Update a task
    #[Route('/api/updateTask/{id}', name: 'updateTask', methods: ['PUT'])]
    public function updateTask(Request $request, EntityManagerInterface $entityManager, int $id): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        $task = $this->taskRepository->findOneBy(['id' => $id]);
        if (!$task) {
            return new JsonResponse(['error' => 'Task not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $task->setTitle(isset($data['title']) ? $data['title'] : $task->getTitle());
        $task->setDescription(isset($data['description']) ? $data['description'] : $task->getDescription());
        $task->setPriority(isset($data['priority']) ? $data['priority'] : $task->getPriority());

        $entityManager->persist($task);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Task updated'], JsonResponse::HTTP_CREATED);
    }

    //Delete a task
    #[Route('/api/deleteTask/{id}', name: 'deleteTask', methods: ['DELETE'])]
    public function deleteTask(Request $request, EntityManagerInterface $entityManager, int $id): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        $table = $this->tableRepository->findOneBy(['id' => $data['table_id']]);
        if (!$table) {
            return new JsonResponse(['error' => 'Table not found'], JsonResponse::HTTP_NOT_FOUND);
        }
        $task = $this->taskRepository->findOneBy(['id' => $id]);
        if (!$task) {
            return new JsonResponse(['error' => 'Task not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $table->removeTask($task);
        $entityManager->remove($task);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Task deleted'], JsonResponse::HTTP_OK);
    }

    #[Route('/api/subtask/{task_id}', name: 'getSubTask', methods: ['GET'])]
    public function getSubtasks(int $task_id): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $task = $this->taskRepository->findOneBy(["id" => $task_id]);
        if (!$task) {
            return new JsonResponse(['error' => 'Task not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $subtasks = [];
        foreach ($task->getSubtasks() as $subtask) {
            $subtasks[] = [
                'id' => $subtask->getId(),
                'title' => $subtask->getTitle(),
                'status' => $subtask->getStatus(),
            ];
        }

        return new JsonResponse($subtasks, JsonResponse::HTTP_OK);
    }


    #[Route('/api/addSubtask/{task_id}', name: 'addSubTask', methods: ['POST'])]
    public function addSubTask(Request $request, EntityManagerInterface $entityManager, int $task_id): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $task = $this->taskRepository->findOneBy(["id" => $task_id]);
        if (!$task) {
            return new JsonResponse(['error' => 'Task not found'], JsonResponse::HTTP_NOT_FOUND);
        }


        $data = json_decode($request->getContent(), true);

        if (!isset($data['title'])) {
            return new JsonResponse(['error' => 'Subtask title is required'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $subtask = new Subtask();
        $subtask->setTitle($data['title']);
        $subtask->setStatus('todo');

        $task->addSubTask($subtask);

        $entityManager->persist($subtask);
        $entityManager->persist($task);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Subtask created successfully'], JsonResponse::HTTP_CREATED);
    }

    #[Route('/api/deleteSubtask/{subtaskid}', name: 'deleteSubTask', methods: ['DELETE'])]
    public function deleteSubtask(int $subtaskid, EntityManagerInterface $entityManager): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        // Buscar la sub-tarea
        $subtask = $this->subtaskRepository->findOneBy(["id" => $subtaskid]);
        if (!$subtask) {
            return new JsonResponse(['error' => 'Subtask not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Buscar la tarea principal
        $task = $this->taskRepository->findOneBy(["id" => $subtask->getTaskId()]);
        if (!$task) {
            return new JsonResponse(['error' => 'Task not found'], JsonResponse::HTTP_NOT_FOUND);
        }


        $task->removeSubtask($subtask);
        $entityManager->remove($subtask);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Subtask deleted successfully'], JsonResponse::HTTP_OK);
    }

    #[Route('/api/changeTaskStatus/{id}', name: 'changeTaskStatus', methods: ['PUT'])]
    public function changeTaskStatus(EntityManagerInterface $entityManager, Request $request, int $id): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        $lang = $request->headers->get('X-Language', 'en');

        $task = $this->taskRepository->findOneBy(['id' => $id]);
        if (!$task) {
            return new JsonResponse(['error' => 'Task not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $statusMessage = $lang === 'es'
            ? 'El usuario cambió el estado a ' . strtoupper($data['status'])
            : 'The user changed status to ' . strtoupper($data['status']);

        $comment = new Comment();
        $comment->setContent($statusMessage);
        $comment->setTask($task);
        $comment->setUser($user);
        $task->setStatus($data['status']);

        $task->addComment($comment);

        $comment->setCreatedAt(new \DateTimeImmutable());
        $user->addComment($comment);
        $entityManager->persist($comment);
        $entityManager->persist($user);
        $entityManager->persist($task);
        $entityManager->flush();
        return new JsonResponse(['message' => 'Task status updated'], JsonResponse::HTTP_OK);
    }

    #[Route('/api/changeAssignee/{id}', name: 'changeAssignee', methods: ['PUT'])]
    public function changeAssignee(EntityManagerInterface $entityManager, Request $request, int $id): JsonResponse
    {
        $locale = $request->headers->get('X-Language', 'en');
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        $task = $this->taskRepository->findOneBy(['id' => $id]);
        if (!$task) {
            return new JsonResponse(['error' => 'Task not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $userAssignee = $this->userRepository->findOneBy(['email' => $data['email']]);
        if (!$userAssignee) {
            return new JsonResponse([
                'error' => $locale === 'es' ? 'Responsable no encontrado' : 'Assignee not found'
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        $table = $task->getTableId();
        $members = $table->getMembers();

        $isMember = false;
        foreach ($members as $member) {
            if ($member->getUser()->getId() === $userAssignee->getId()) {
                $isMember = true;
                break;
            }
        }

        if (!$isMember) {
            return new JsonResponse([
                'error' => $locale === 'es' ? 'El usuario no es miembro de la tabla' : 'User is not a member of the table'
            ], JsonResponse::HTTP_FORBIDDEN);
        }

        $task->setAssigneeId($userAssignee);
        $userAssignee->addAssignedTask($task);
        $entityManager->persist($task);
        $entityManager->persist($userAssignee);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Assignee updated'], JsonResponse::HTTP_OK);
    }



    #[Route('/api/comments/{task_id}', name: 'getTaskComments', methods: ['GET'])]
    public function getComments(int $task_id): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $task = $this->taskRepository->findOneBy(["id" => $task_id]);
        if (!$task) {
            return new JsonResponse(['error' => 'Task not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Convertir la colección en array y luego invertir el orden
        $commentsCollection = $task->getComments();
        $commentsArray = array_reverse(iterator_to_array($commentsCollection));

        $comments = [];
        foreach ($commentsArray as $comment) {
            $comments[] = [
                'id' => $comment->getId(),
                'content' => $comment->getContent(),
                'task' => $comment->getTask()->getId(),
                'user' => $comment->getUser()->getEmail(),
                'created_at' => $comment->getCreatedAt(),
            ];
        }

        return new JsonResponse($comments, JsonResponse::HTTP_OK);
    }

    #[Route('/api/newComments/{task_id}', name: 'addComments', methods: ['POST'])]
    public function addComment(int $task_id, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $task = $this->taskRepository->findOneBy(["id" => $task_id]);
        if (!$task) {
            return new JsonResponse(['error' => 'Task not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        if (!isset($data['content'])) {
            return new JsonResponse(['error' => 'Content is required'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $comment = new Comment();
        $comment->setContent($data['content']);
        $comment->setTask($task);
        $comment->setUser($user);
        $comment->setCreatedAt(new \DateTimeImmutable());

        $task->addComment($comment);
        $user->addComment($comment);

        $entityManager->persist($task);
        $entityManager->persist($user);
        $entityManager->persist($comment);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Comment added'], JsonResponse::HTTP_OK);
    }

    #[Route('/api/deleteComment/{comment_id}', name: 'deleteComment', methods: ['DELETE'])]
    public function deleteComment(int $comment_id, EntityManagerInterface $entityManager): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $comment = $this->commentRepository->findOneBy(["id" => $comment_id]);
        if (!$comment) {
            return new JsonResponse(['error' => 'Comment not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $task = $comment->getTask();
        if (!$task) {
            return new JsonResponse(['error' => 'Task not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $userComment = $comment->getUser();

        $task->removeComment($comment);
        $userComment->removeComment($comment);
        $entityManager->remove($comment);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Comment deleted'], JsonResponse::HTTP_OK);
    }
}
