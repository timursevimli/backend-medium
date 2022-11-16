import { UserEntity } from '../user/user.entity';
import {
	BeforeUpdate,
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'articles' })
export class ArticleEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	slug: string;

	@Column()
	title: string;

	@Column({ default: '' })
	description: string;

	@Column({ default: '' })
	body: string;

	@Column('simple-array')
	tagList: string[];

	@Column({ default: 0 })
	favoritesCount: number;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	createdAt: Date;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	updatedAt: Date;

	@BeforeUpdate()
	updateTimestamp(): void {
		this.updatedAt = new Date();
	}

	@ManyToOne(() => UserEntity, (user) => user.articles)
	author: UserEntity;
}
