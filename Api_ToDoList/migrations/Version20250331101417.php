<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250331101417 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE table_user DROP FOREIGN KEY FK_C7459682A76ED395');
        $this->addSql('ALTER TABLE table_user DROP FOREIGN KEY FK_C7459682ECFF285C');
        $this->addSql('DROP TABLE table_user');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE table_user (table_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_C7459682ECFF285C (table_id), INDEX IDX_C7459682A76ED395 (user_id), PRIMARY KEY(table_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE table_user ADD CONSTRAINT FK_C7459682A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON UPDATE NO ACTION ON DELETE CASCADE');
        $this->addSql('ALTER TABLE table_user ADD CONSTRAINT FK_C7459682ECFF285C FOREIGN KEY (table_id) REFERENCES `table` (id) ON UPDATE NO ACTION ON DELETE CASCADE');
    }
}
