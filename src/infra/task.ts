import type { ITaskRepository } from "../domain/task";
import { Task, TaskId, TaskName } from "../domain/task";
import { UserId } from "../domain/user";
import type { Database } from "./database";

export class TaskRepository implements ITaskRepository {
  constructor(private readonly db: Database) {}

  async create(task: Task): Promise<Task> {
    const result = await this.db.tasks.create({
      data: {
        id: task._id._value,
        name: task._name._value,
        status: task._status,
        assigned_user_id: task._assignedUserId?._value,
        created_by_user_id: task._createdByUserId._value,
      },
    });

    task.reconstructor(new TaskId(result.id), new TaskName(result.name), result.status, new UserId(result.created_by_user_id), result.assigned_user_id ? new UserId(result.assigned_user_id) : undefined);

    return task;
  }

  async save(task: Task): Promise<Task> {
    const result = await this.db.tasks.update({
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

    task.reconstructor(new TaskId(result.id), new TaskName(result.name), result.status, new UserId(result.created_by_user_id), result.assigned_user_id ? new UserId(result.assigned_user_id) : undefined);

    return task;
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

    const createdByUserId = new UserId(result.created_by_user_id);

    const assignedUserId = result.assigned_user_id ? new UserId(result.assigned_user_id) : undefined;


    const task =new Task(
      new TaskName(result.name),
      result.status,
      createdByUserId,
      assignedUserId
    );

    task.reconstructor(new TaskId(result.id), new TaskName(result.name), result.status, createdByUserId, assignedUserId);

    return task;
  }
}

