<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Repository\UserRepository;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;


final class LoginController extends AbstractController
{
    public function __construct(private UserRepository $userRepository)
    {
        
    }

    #[Route('/api/login', name: 'app_login', methods:['POST'])]
    public function login(Request $request, JWTTokenManagerInterface $JWTmanager, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        // Validate that email and password are provided
        if (!isset($data['email']) || !isset($data['password'])) {
            return new JsonResponse(
                ['error' => 'Email and password are required'], 
                Response::HTTP_BAD_REQUEST
            );
        }

        // Check if user exists
        $user = $this->userRepository->findOneBy(['email' => $data['email']]);
        if (!$user) {
            return new JsonResponse(
                ['error' => 'Email not found'], 
                Response::HTTP_UNAUTHORIZED
            );
        }

        // Verify password
        if (!$passwordHasher->isPasswordValid($user, $data['password'])) {
            return new JsonResponse(
                ['error' => 'Invalid password'], 
                Response::HTTP_UNAUTHORIZED
            );
        }

        // Get user data and create token
        $token = $JWTmanager->create($user);
        
        // Create response data
        $responseData = [
            'token' => $token,
            'roles' => $user->getRoles(),
            'email' => $user->getEmail()   
        ];

        return new JsonResponse($responseData, Response::HTTP_OK);
    }

    #[Route('/api/register', name: 'app_register', methods:['POST'])]
    public function register(Request $request, JWTTokenManagerInterface $jwtmanager, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(),true);
        
        if(!isset($data['email']) || !isset($data['password'])){
            return new JsonResponse(['error' => 'Email and password are required'],Response::HTTP_BAD_REQUEST);
        }

        $user = $this->userRepository->findOneBy(['email' => $data['email']]);

        if($user){
            return new JsonResponse(
                ['error' => 'Email already exists'],
                Response::HTTP_BAD_REQUEST
            );
        }

        $user = new User();
        $user->setEmail($data['email']);
        $user->setPassword($passwordHasher->hashPassword($user,$data['password']));
        $user->setRoles(['ROLE_USER']);
        $entityManager->persist($user);
        $entityManager->flush();

        $token = $jwtmanager->create($user);

        return new JsonResponse(['message' => 'User created succesfully', 'token' => $token],Response::HTTP_OK);
    }
}
