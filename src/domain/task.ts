import { UserId } from "./user";

export const TASK_STATUS_DONE = 'DONE';
export const TASK_STATUS_IN_PROGRESS = 'IN_PROGRESS';
export const TASK_STATUS_TODO = 'TODO';

const TASK_STATUS_TYPE = [
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_TODO,
] as const;

export type TaskStatusType = (typeof TASK_STATUS_TYPE)[number];

export class TaskId {
  private value!: string;
  constructor() {}

  set _value(value: string) {
    this.value = value;
  }

  get _value(): string {
    return this.value;
  }
}

export class TaskName {
  constructor(private readonly value: string) {
    if (value.length < 1 || value.length > 100) {
      throw new Error('タスク名は1文字以上100文字以下である必要があります');
    }
  }

  get _value(): string {
    return this.value;
  }
}

export class Task {
  constructor(
    private readonly id: TaskId,
    private name: TaskName,
    private status: TaskStatusType = TASK_STATUS_TODO,
    private createdByUserId: UserId,
    private assignedUserId?: UserId
  ) {}

  get _id(): TaskId {
    return this.id;
  }

  get _name(): TaskName {
    return this.name;
  }

  get _status(): TaskStatusType {
    return this.status;
  }

  get _createdByUserId(): UserId {
      return this.createdByUserId;
  }

  get _assignedUserId(): UserId | undefined {
    return this.assignedUserId;
  }

  toDone(): Task {
    this.status = TASK_STATUS_DONE;
    return this;
  }

  toInProgress(): Task {
    this.status = TASK_STATUS_IN_PROGRESS;
    return this;
  }

  toTodo(): Task {
    this.status = TASK_STATUS_TODO;
    return this;
  }

  rename(name: TaskName): Task {
    this.name = name;
    return this;
  }

  assign(userId: UserId): Task {
    this.assignedUserId = userId;
    return this;
  }
}


export interface ITaskRepository {
  create(task: Task): Promise<void>;
  save(task: Task): Promise<void>;
  findById(id: TaskId): Promise<Task | null>;
}
