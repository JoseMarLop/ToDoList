<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\TableRepository;
use App\Entity\User;
use App\Entity\Table;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

final class TableController extends AbstractController
{

    public function __construct(private TableRepository $tableRepository) {}

    //Obtain all the tables from an user with its tasks
    #[Route('/api/tables', name: 'getUserTables', methods: ['GET'])]
    public function getUserTables(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $tables = $this->tableRepository->findBy(['owner' => $user]);

        if (empty($tables)) {
            return new JsonResponse(['message' => 'Tables not found for this User'], JsonResponse::HTTP_NOT_FOUND);
        }

        $data = [];
        foreach ($tables as $table) {
            $tasks = [];
            foreach ($table->getTasks() as $task) {
                $tasks[] = [
                    'id' => $task->getId(),
                    'title' => $task->getTitle(),
                    'description' => $task->getDescription(),
                    'status' => $task->getStatus(),
                    'created_at' => $task->getCreatedAt(),
                ];
            }
            $data[] = [
                'id' => $table->getId(),
                'name' => $table->getName(),
                'description' => $table->getDescription(),
                'created_at' => $table->getCreatedAt(),
                'owner' => $user->getId(),
                'tasks' => $tasks,
            ];
        }

        return new JsonResponse($data, JsonResponse::HTTP_OK);
    }

    //Create a new table for the logged user
    #[Route('/api/newTable', name: 'addTable', methods: ['POST'])]
    public function addTable(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if ($data['name'] === null) {
            return new JsonResponse(['error' => 'Name is required'], Response::HTTP_BAD_REQUEST);
        }

        $table = new Table();
        $table->setName($data['name']);
        $table->setDescription($data['description'] ?? null);
        $table->setCreatedAt(new \DateTimeImmutable());
        $table->setOwner($user);
        $entityManager->persist($table);
        $entityManager->flush();
        return new JsonResponse(['message' => "Board Created"]);
    }

    //Update a table
    #[Route('/api/updateTable/{id}', name: 'updateTable', methods: ['PUT'])]
    public function updateTable(Request $request, EntityManagerInterface $entityManager,int $id): JsonResponse{
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $table = $this->tableRepository->findOneBy(['id' => $id]);
        if (!$table) {
            return new JsonResponse(['error' => 'Table not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        $table->setName(isset($data['name']) ? $data['name'] : $table->getName());
        $table->setDescription(isset($data['description']) ? $data['description'] : $table->getDescription());
        $entityManager->persist($table);
        $entityManager->flush();
        return new JsonResponse(['message' => 'Table updated'], Response::HTTP_OK);
    }

    //Delete a table
    #[Route('/api/deleteTable/{id}', name: 'deleteTable', methods: ['DELETE'])]
    public function deleteTable(EntityManagerInterface $entityManager, int $id): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $table = $this->tableRepository->findOneBy(['id' => $id]);
        if (!$table) {
            return new JsonResponse(['error' => 'Table not found'], Response::HTTP_NOT_FOUND);
        }
        $user->removeTable($table);
        $entityManager->remove($table);
        $entityManager->flush();
        return new JsonResponse(['message' => 'Table deleted'], Response::HTTP_OK);
    }
}
