import { Entity, ObjectIdColumn, Column } from 'typeorm'
import Task from './Task';
import "reflect-metadata";

@Entity()
export class User {
	@ObjectIdColumn()
	id: ObjectId

	@Column()
	username:string

	@Column()
	password:string

	@Column()
	email:string

	@OneToMany(() => Task, task => task.user)
	tasks
}
