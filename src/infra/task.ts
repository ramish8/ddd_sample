import type { ITaskRepository } from "../domain/task";
import { Task, TaskId, TaskName } from "../domain/task";
import { UserId } from "../domain/user";
import type { Database } from "./database";

export class TaskRepository implements ITaskRepository {
  constructor(private readonly db: Database) {}

  async create(task: Task): Promise<void> {
    await this.db.tasks.create({
      data: {
        id: task._id._value,
        name: task._name._value,
        status: task._status,
        assigned_user_id: task._assignedUserId?._value,
        created_by_user_id: task._createdByUserId._value,
      },
    });
  }

  async save(task: Task): Promise<void> {
    await this.db.tasks.update({
      where: {
        id: task._id._value,
      },
      data: {
        name: task._name._value,
        status: task._status,
        assigned_user_id: task._assignedUserId?._value,
        created_by_user_id: task._createdByUserId._value,
      },
    });
  }

  async findById(id: TaskId): Promise<Task | null> {
    const result = await this.db.tasks.findUnique({
      where: {
        id: id._value,
      },
    });

    if (!result) {
      return null;
    }

    const createdByUserId = new UserId();
    createdByUserId._value = result.created_by_user_id;

    // NOTE: constだけを使いたいなら違う設計にした方がよい
    let assignedUserId: UserId | undefined;
    if (result.assigned_user_id) {
      assignedUserId = new UserId();
      assignedUserId._value = result.assigned_user_id;
    }


    return new Task(
      new TaskId(),
      new TaskName(result.name),
      result.status,
      createdByUserId,
      assignedUserId
    );
  }
}

