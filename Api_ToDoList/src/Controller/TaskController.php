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
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Task;

final class TaskController extends AbstractController
{

    public function __construct(private TaskRepository $taskRepository, private TableRepository $tableRepository) {}

    //Obtain a task with its subtasks
    #[Route('/api/task/{id}', name: 'getTask', methods: ['GET'])]
    public function index(int $id): JsonResponse
    {
        $task = $this->taskRepository->findOneBy(['id' => $id]);

        if (empty($task)) {
            return new JsonResponse(['message' => 'Task not found'], JsonResponse::HTTP_NOT_FOUND);
        }
        $subtasks = [];
        foreach ($task->getSubtasks() as $subtask) {
            $subtasks[] = [
                'id' => $subtask->getId(),
                'title' => $subtask->getTitle(),
                'status' => $subtask->getStatus(),
            ];
        }
        $data = [
            'id' => $task->getId(),
            'title' => $task->getTitle(),
            'description' => $task->getDescription(),
            'status' => $task->getStatus(),
            'created_at' => $task->getCreatedAt(),
            'subtasks' => $subtasks
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
        $task->setDescription($data['description']);
        $task->setStatus($data['status']);
        $task->setPriority($data['priority']);
        $task->setCreatedAt(new \DateTimeImmutable());
        $task->setDueAt($data['due_at']);
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
        $task->setStatus(isset($data['status']) ? $data['status'] : $task->getStatus());
        $task->setPriority(isset($data['priority']) ? $data['priority'] : $task->getPriority());
        $task->setDueAt(isset($data['due_at']) ? $data['due_at'] : $task->getDueAt());
    
        $entityManager->persist($task);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Task updated'], JsonResponse::HTTP_CREATED);
    }

    //Delete a task
    #[Route('/api/deleteTask/{id}', name: 'deleteTask', methods: ['DELETE'])]
    public function deleteTask(Request $request,EntityManagerInterface $entityManager, int $id): JsonResponse
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

        return new JsonResponse(['message' => 'Task deleted'], JsonResponse::HTTP_CREATED);
    }
}
