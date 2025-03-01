<?php

namespace App\Entity;

use App\Repository\TaskRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TaskRepository::class)]
class Task
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(length: 255)]
    private ?string $description = null;

    #[ORM\Column(length: 255)]
    private ?string $status = null;

    #[ORM\Column(length: 255)]
    private ?string $priority = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $due_at = null;

    #[ORM\ManyToOne(inversedBy: 'tasks')]
    #[ORM\JoinColumn(nullable: false)]
    private ?table $proyect_id = null;

    #[ORM\ManyToOne(inversedBy: 'assigned_tasks')]
    private ?user $assignee = null;

    /**
     * @var Collection<int, Subtask>
     */
    #[ORM\OneToMany(targetEntity: Subtask::class, mappedBy: 'task_id', orphanRemoval: true)]
    private Collection $subtasks;

    public function __construct()
    {
        $this->subtasks = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getPriority(): ?string
    {
        return $this->priority;
    }

    public function setPriority(string $priority): static
    {
        $this->priority = $priority;

        return $this;
    }

    public function getDueAt(): ?string
    {
        return $this->due_at;
    }

    public function setDueAt(?string $due_at): static
    {
        $this->due_at = $due_at;

        return $this;
    }

    public function getProyectId(): ?table
    {
        return $this->proyect_id;
    }

    public function setProyectId(?table $proyect_id): static
    {
        $this->proyect_id = $proyect_id;

        return $this;
    }

    public function getAssignee(): ?user
    {
        return $this->assignee;
    }

    public function setAssignee(?user $assignee): static
    {
        $this->assignee = $assignee;

        return $this;
    }

    /**
     * @return Collection<int, Subtask>
     */
    public function getSubtasks(): Collection
    {
        return $this->subtasks;
    }

    public function addSubtask(Subtask $subtask): static
    {
        if (!$this->subtasks->contains($subtask)) {
            $this->subtasks->add($subtask);
            $subtask->setTaskId($this);
        }

        return $this;
    }

    public function removeSubtask(Subtask $subtask): static
    {
        if ($this->subtasks->removeElement($subtask)) {
            // set the owning side to null (unless already changed)
            if ($subtask->getTaskId() === $this) {
                $subtask->setTaskId(null);
            }
        }

        return $this;
    }
}
