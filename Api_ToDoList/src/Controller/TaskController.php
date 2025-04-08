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

final class TaskController extends AbstractController
{

    public function __construct(private TaskRepository $taskRepository, private TableRepository $tableRepository,private SubtaskRepository $subtaskRepository) {}

    //Obtain a task with its subtasks
    #[Route('/api/task/{id}', name: 'getTask', methods: ['GET'])]
    public function index(int $id): JsonResponse
    {
        $task = $this->taskRepository->findOneBy(['id' => $id]);

        if (empty($task)) {
            return new JsonResponse(['message' => 'Task not found'], JsonResponse::HTTP_NOT_FOUND);
        }
        
        $data = [
            'id' => $task->getId(),
            'title' => $task->getTitle(),
            'description' => $task->getDescription(),
            'status' => $task->getStatus(),
            'created_at' => $task->getCreatedAt(),
            'priority' => $task->getPriority(),
            'due_at' => $task->getDueAt(),
            'table_id' => $task->getTableId()->getId()
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
    public function getSubtasks(int $task_id): JsonResponse{
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
    public function changeTaskStatus(EntityManagerInterface $entityManager, Request $request,int $id): JsonResponse{
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

        $task->setStatus($data['status']);
        $entityManager->persist($task);
        $entityManager->flush();
        return new JsonResponse(['message' => 'Task status updated'], JsonResponse::HTTP_OK);
    }


}
