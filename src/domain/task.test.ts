import { describe, expect, it } from 'vitest';
import { TaskId, TaskName } from './task';

describe('TaskId', () => {
  it('タスクIDの値を取得出来ること', () => {
    const taskId = new TaskId("test");
    expect(taskId._value).toBe("test");
  });
});

describe('TaskName', () => {
  it('タスク名の値を取得出来ること', () => {
    const taskName = new TaskName("test");
    expect(taskName._value).toBe("test");
  });


  it('タスク名が空文字の場合はエラーを返すこと', () => {
    expect(() => new TaskName("")).toThrow();
  });

  it('タスク名が100文字を超える場合はエラーを返すこと', () => {
    expect(() => new TaskName("a".repeat(101))).toThrow();
  });
});
