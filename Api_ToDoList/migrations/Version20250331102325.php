<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250331102325 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE `member` (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, board_id INT NOT NULL, rol VARCHAR(15) NOT NULL, INDEX IDX_70E4FA78A76ED395 (user_id), INDEX IDX_70E4FA78E7EC5785 (board_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE `member` ADD CONSTRAINT FK_70E4FA78A76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE `member` ADD CONSTRAINT FK_70E4FA78E7EC5785 FOREIGN KEY (board_id) REFERENCES `table` (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE `member` DROP FOREIGN KEY FK_70E4FA78A76ED395');
        $this->addSql('ALTER TABLE `member` DROP FOREIGN KEY FK_70E4FA78E7EC5785');
        $this->addSql('DROP TABLE `member`');
    }
}
