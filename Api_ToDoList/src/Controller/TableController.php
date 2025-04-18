<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\TableRepository;
use App\Entity\User;
use App\Entity\Table;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

final class TableController extends AbstractController
{

    public function __construct(private TableRepository $tableRepository) {}

    #[Route('/api/alltables', name: 'getAllUserTables', methods: ['GET'])]
    public function getAllUserTables(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $ownerTables = $this->tableRepository->findBy(['owner' => $user]);

        $memberTables = [];
        foreach ($user->getMemberTables() as $member) {
            $memberTables[] = $member->getBoard();
        }

        $ownerData = [];
        foreach ($ownerTables as $table) {
            $tasks = [];
            foreach ($table->getTasks() as $task) {
                $tasks[] = [
                    'id' => $task->getId(),
                    'title' => $task->getTitle(),
                    'description' => $task->getDescription(),
                    'status' => $task->getStatus(),
                    'created_at' => $task->getCreatedAt(),
                    'priority' => $task->getPriority()
                ];
            }

            $membersWithRoles = [];
            foreach ($table->getMembers() as $member) {
                $userMember = $member->getUser();
                if ($userMember) {
                    $membersWithRoles[] = [
                        'email' => $userMember->getEmail(),
                        'role' => $member->getRol(),
                        'id' => $userMember->getId(),
                        'member_id' => $member->getId()
                    ];
                }
            }

            $ownerData[] = [
                'id' => $table->getId(),
                'name' => $table->getName(),
                'description' => $table->getDescription(),
                'created_at' => $table->getCreatedAt(),
                'owner' => $table->getOwner()->getEmail(),
                'tasks' => $tasks,
                'user_rol' => 'admin',
                'members' => $membersWithRoles,
            ];
        }


        $memberData = [];
        foreach ($memberTables as $table) {
            $tasks = [];
            foreach ($table->getTasks() as $task) {
                $tasks[] = [
                    'id' => $task->getId(),
                    'title' => $task->getTitle(),
                    'description' => $task->getDescription(),
                    'status' => $task->getStatus(),
                    'created_at' => $task->getCreatedAt(),
                    'priority' => $task->getPriority()
                ];
            }


            $userRole = 'no_role';
            foreach ($table->getMembers() as $member) {
                if ($member->getUser()->getId() === $user->getId()) {
                    $userRole = $member->getRol();
                    break;
                }
            }

            $membersWithRoles = [];
            foreach ($table->getMembers() as $member) {
                $userMember = $member->getUser();
                if ($userMember) {
                    $membersWithRoles[] = [
                        'email' => $userMember->getEmail(),
                        'role' => $member->getRol(),
                        'id' => $userMember->getId(),
                        'member_id' => $member->getId()
                    ];
                }
            }

            $memberData[] = [
                'id' => $table->getId(),
                'name' => $table->getName(),
                'description' => $table->getDescription(),
                'created_at' => $table->getCreatedAt(),
                'owner' => $table->getOwner()->getEmail(),
                'tasks' => $tasks,
                'user_rol' => $userRole,
                'members' => $membersWithRoles,
            ];
        }


        $data = [
            'owned' => $ownerData,
            'member' => $memberData,
        ];

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
    public function updateTable(Request $request, EntityManagerInterface $entityManager, int $id): JsonResponse
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
