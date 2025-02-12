// NOTE: 本当はhonoで受け取るような構造にしたいけど、単にDDDっぽい表現をしたいだけなので適当な関数にする

import { TaskName, type TaskStatusType, Task, TaskId } from "../../domain/task";
import type { UserId } from "../../domain/user";
import { prisma } from "../../infra/database";
import { TaskRepository } from "../../infra/task";
import { CreateTaskUsecase } from "../../usecase/task/create_task";

export const createTask = async (name: TaskName, status: TaskStatusType, createdByUserId: UserId, assignedUserId?: UserId): Promise<void> => {
  
  await prisma.$transaction(async (tx) => {
    const usecase = new CreateTaskUsecase(new TaskRepository(tx));
    await usecase.execute(name, status, createdByUserId, assignedUserId);
  });
};
