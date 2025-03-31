<?php

namespace App\Controller;

use App\Entity\Member;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\TableRepository;
use App\Repository\UserRepository;


final class MemberController extends AbstractController
{

    public function __construct(private TableRepository $tableRepository, private UserRepository $userRepository) {}

    //Add member
    #[Route('/api/addMember/{table_id}', name: 'addMember', methods: ['POST'])]
    public function addMember(Request $request, EntityManagerInterface $entityManager, int $table_id): JsonResponse
    {



        $table = $this->tableRepository->findOneBy(['id' => $table_id]);
        if (!$table) {
            return new JsonResponse(['error' => 'Table not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['user_id'])) {
            return new JsonResponse(['error' => 'User ID is required'], Response::HTTP_BAD_REQUEST);
        }

        $user = $this->userRepository->findOneBy(['id' => $data['user_id']]);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $existingMember = $entityManager->getRepository(Member::class)->findOneBy([
            'user' => $user,
            'board' => $table
        ]);

        if ($existingMember) {
            return new JsonResponse(['error' => 'User is already a member of this table'], Response::HTTP_CONFLICT);
        }

        $member = new Member();
        $member->setUser($user);
        $member->setBoard($table);
        $member->setRol($data['rol'] ?? 'member');


        $user->addMemberTable($member);
        $table->addMember($member);


        $entityManager->persist($member);
        $entityManager->persist($user);
        $entityManager->persist($table);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Member added successfully', 'member' => $member->getId()], Response::HTTP_CREATED);
    }

    // Get all members of a table
    #[Route('/api/members/{table_id}', name: 'getMembers', methods: ['GET'])]
    public function getMembers(int $table_id): JsonResponse
    {
        $table = $this->tableRepository->findOneBy(['id' => $table_id]);
        if (!$table) {
            return new JsonResponse(['error' => 'Table not found'], Response::HTTP_NOT_FOUND);
        }

        $members = $table->getMembers(); 

        $data = [];
        foreach ($members as $member) {
            $data[] = [
                'id' => $member->getId(),
                'user_id' => $member->getUser()->getId(),
                'rol' => $member->getRol(),
            ];
        }

        return new JsonResponse($data, Response::HTTP_OK);
    }

     // Delete member
     #[Route('/api/deleteMember/{member_id}', name: 'deleteMember', methods: ['DELETE'])]
     public function deleteMember(EntityManagerInterface $entityManager, int $member_id): JsonResponse
     {
         $member = $entityManager->getRepository(Member::class)->find($member_id);
         if (!$member) {
             return new JsonResponse(['error' => 'Member not found'], Response::HTTP_NOT_FOUND);
         }
 
         $entityManager->remove($member);
         $entityManager->flush();
 
         return new JsonResponse(['message' => 'Member deleted successfully'], Response::HTTP_OK);
     }
}
