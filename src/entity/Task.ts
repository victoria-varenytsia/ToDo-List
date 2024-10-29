import { Entity, ObjectIdColumn, Column } from 'typeorm'
import { ObjectId } from 'mongodb'
import "reflect-metadata"; 


@Entity()
export class Task {
	@ObjectIdColumn()
	id: ObjectId 

	@Column()
	todo: string 
}
