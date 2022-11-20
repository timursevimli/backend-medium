import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'comments' })
export class CommentEntity {
	@PrimaryGeneratedColumn()
	readonly id: number;

	@Column()
	body: string;

	@Column()
	articleId: number;

	@Column()
	commentorId: number;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	createdAt: Date;
}
