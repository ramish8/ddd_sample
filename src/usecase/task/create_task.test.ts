import { describe, it, expect, vi } from 'vitest';
import { CreateTaskUsecase } from './create_task';
import { Task, type ITaskRepository, TaskName, TASK_STATUS_TODO, TaskId } from '../../domain/task';
import { UserId } from '../../domain/user';

// NOTE: DB接続を伴わない結合テスト
describe('CreateTaskUsecase', () => {
  it('タスクが作成されること', async () => {
    const mockTaskRepository: ITaskRepository = {
      create: vi.fn().mockImplementation((task: Task) => {
        const createdTask = task;
        createdTask.reconstructor(
          new TaskId('test-task-id'),
          task._name,
          task._status,
          task._createdByUserId,
          task._assignedUserId
        );
        return Promise.resolve(createdTask);
      }),
      findById: vi.fn(),
      save: vi.fn(),
    };

    const usecase = new CreateTaskUsecase(mockTaskRepository);

    const taskName = new TaskName('テストタスク');
    const taskStatus = TASK_STATUS_TODO;
    const createdByUserId = new UserId('user-1');
    const assignedUserId = new UserId('user-2');

    const createdTask = await usecase.execute(taskName, taskStatus, createdByUserId, assignedUserId);

    expect(mockTaskRepository.create).toHaveBeenCalledTimes(1);
    expect(createdTask).toBeInstanceOf(Task);
    expect(createdTask._id._value).toBe('test-task-id');
    expect(createdTask._name).toBe(taskName);
    expect(createdTask._status).toBe(taskStatus);
    expect(createdTask._createdByUserId).toBe(createdByUserId);
    expect(createdTask._assignedUserId).toBe(assignedUserId);
  });

  it('担当者なしでタスクが作成されること', async () => {
    const mockTaskRepository: ITaskRepository = {
      create: vi.fn().mockImplementation((task: Task) => {
        const createdTask = task;
        createdTask.reconstructor(
          new TaskId('test-task-id'),
          task._name,
          task._status,
          task._createdByUserId,
          task._assignedUserId
        );
        return Promise.resolve(createdTask);
      }),
      findById: vi.fn(),
      save: vi.fn(),
    };

    const usecase = new CreateTaskUsecase(mockTaskRepository);

    const taskName = new TaskName('テストタスク');
    const taskStatus = TASK_STATUS_TODO;
    const createdByUserId = new UserId('user-1');

    const createdTask = await usecase.execute(taskName, taskStatus, createdByUserId);

    expect(mockTaskRepository.create).toHaveBeenCalledTimes(1);
    expect(createdTask).toBeInstanceOf(Task);
    expect(createdTask._id._value).toBe('test-task-id');
    expect(createdTask._assignedUserId).toBeUndefined();
  });
});
