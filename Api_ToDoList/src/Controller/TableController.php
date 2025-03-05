<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\TableRepository;
use App\Entity\User;

final class TableController extends AbstractController
{

    public function __construct(private TableRepository $tableRepository) {}

    #[Route('/api/tables', name: 'getUserTables', methods: ['GET'])]
    public function getTables(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $tables = $this->tableRepository->findAllBy(['user' => $user]);

        if (empty($tables)) {
            return new JsonResponse(['message' => 'Tables not found for this User'], JsonResponse::HTTP_NOT_FOUND);
        }

        $data = [];
        foreach ($tables as $table) {
            $data[] = [
                'id' => $table->getId(),
                'name' => $table->getName(),
                'description' => $table->getDescription(),
                'created_at' => $table->getCreatedAt(),
                'owner' => $user->getId(),
            ];
        }

        return new JsonResponse($data, JsonResponse::HTTP_OK);
    }
}
