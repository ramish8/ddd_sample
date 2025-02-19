import { Task, TaskId, type ITaskRepository, type TaskName, type TaskStatusType } from "../../domain/task";
import type { UserId } from "../../domain/user";

export class CreateTaskUsecase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(name: TaskName, status: TaskStatusType, createdByUserId: UserId, assignedUserId?: UserId): Promise<Task> {
    const task = new Task(name, status, createdByUserId, assignedUserId);
    return await this.taskRepository.create(task);
  }
}
