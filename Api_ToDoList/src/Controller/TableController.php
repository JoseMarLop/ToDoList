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

        // Tablas de las cuales el usuario es miembro
        $memberTables = [];
        foreach ($user->getMemberTables() as $member) {
            // Aquí obtenemos el tablero desde la entidad miembro
            $memberTables[] = $member->getBoard();
        }

        // Preparamos los datos para las tablas de las cuales el usuario es dueño
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
                ];
            }

            // Agregamos el rol 'admin' para las tablas de las cuales es dueño
            $membersWithRoles = [];
            foreach ($table->getMembers() as $member) {
                $user = $member->getUser();
                if ($user) {
                    $membersWithRoles[] = [
                        'email' => $user->getEmail(),
                        'role' => $member->getRol(), // El rol del miembro
                    ];
                }
            }

            $ownerData[] = [
                'id' => $table->getId(),
                'name' => $table->getName(),
                'description' => $table->getDescription(),
                'created_at' => $table->getCreatedAt(),
                'owner' => $user->getId(),
                'tasks' => $tasks,
                'user_rol' => 'admin',  // El rol del dueño es siempre 'admin'
                'members' => $membersWithRoles, // Miembros con sus roles
            ];
        }

        // Preparamos los datos para las tablas de las cuales el usuario es miembro
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
                ];
            }

            // Obtenemos el rol del usuario en esta tabla
            $userRole = 'no_role'; // Valor por defecto en caso de que no sea miembro
            foreach ($table->getMembers() as $member) {
                if ($member->getUser() === $user) {
                    $userRole = $member->getRol(); // El rol del usuario en esta tabla
                    break;
                }
            }

            // Agregamos los miembros con sus roles
            $membersWithRoles = [];
            foreach ($table->getMembers() as $member) {
                $user = $member->getUser();
                if ($user) {
                    $membersWithRoles[] = [
                        'email' => $user->getEmail(),
                        'role' => $member->getRol(), // El rol del miembro
                    ];
                }
            }

            $memberData[] = [
                'id' => $table->getId(),
                'name' => $table->getName(),
                'description' => $table->getDescription(),
                'created_at' => $table->getCreatedAt(),
                'owner' => $table->getOwner()->getId(),
                'tasks' => $tasks,
                'user_rol' => $userRole, // El rol del usuario en esta tabla
                'members' => $membersWithRoles, // Miembros con sus roles
            ];
        }

        // Devolvemos los resultados organizados en dos claves: 'owned' y 'member'
        $data = [
            'owned' => $ownerData,
            'member' => $memberData,
        ];

        return new JsonResponse($data, JsonResponse::HTTP_OK);
    }

    //Get the data from a single table with the members
    #[Route('/api/getSingleTable/{id}', name: 'getSingleTable', methods: ['GET'])]
    public function getSingleTable(int $id): JsonResponse
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

        $members = $table->getMembers();

        $memberEmails = [];
        foreach ($members as $member) {
            $user = $member->getUser();
            if ($user) {
                $memberEmails[] = $user->getEmail();
            }
        }

        $data = [
            'id' => $table->getId(),
            'name' => $table->getName(),
            'description' => $table->getDescription(),
            'created_at' => $table->getCreatedAt(),
            'owner' => $table->getOwner()->getEmail(),
            'members' => $memberEmails,
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
