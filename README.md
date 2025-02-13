# DDD Sample Application

このプロジェクトは、ドメイン駆動設計（DDD）に雑に則ったアプリケーションです。
解釈が間違っている部分があれば、ご指摘いただけると幸いです。

## アーキテクチャ概要

このアプリケーションは以下の層に分かれています：

- **Domain 層**: ビジネスロジックとドメインモデルを含む中核的な層
- **UseCase 層**: アプリケーションのユースケースを実装する層
- **Presentation 層**: API エンドポイントや UI を提供する層
- **Infrastructure 層**: データベースやその他の外部サービスとの連携を担当する層

### 依存性の逆転原則（DIP）の採用

Infrastructure 層では、依存性の逆転原則（DIP）を採用しています。これにより：

1. Infrastructure 層は抽象（インターフェース）に依存し、具体的な実装の詳細から分離されています
2. 各層は内側の層にのみ依存し、外側の層には依存しません

例えば、タスクの永続化に関する実装では：

```typescript
// Domain層でリポジトリのインターフェースを定義
export interface ITaskRepository {
  create(task: Task): Promise<Task>;
  save(task: Task): Promise<Task>;
  findById(id: TaskId): Promise<Task | null>;
}

// Infrastructure層で実装を提供
export class TaskRepository implements ITaskRepository {
  constructor(private readonly db: Database) {}

  async create(task: Task): Promise<Task> {
    // 実装の詳細
  }
  // ...
}
```

### 主なメリット

#### 1. テスタビリティの向上

- 依存性注入（DI）を活用することで、テスト時にモックオブジェクトを容易に注入できます
- ドメインロジックを純粋な形で単体テストすることが可能です

例えば、ユースケースのテストでは以下のようにモックを利用できます：

```typescript
describe("CreateTaskUsecase", () => {
  it("タスクが作成されること", async () => {
    const mockTaskRepository: ITaskRepository = {
      create: vi.fn().mockImplementation((task: Task) => {
        // モックの実装
      }),
      // ...
    };

    // NOTE: mockをDIする
    const usecase = new CreateTaskUsecase(mockTaskRepository);
    // テストの実行
  });
});
```

#### 2. 柔軟な実装の変更

- インフラストラクチャの実装（データベースや外部サービス）を、アプリケーションのコアロジックに影響を与えることなく変更できます
- 新しい要件や技術の変更に対して、影響範囲を最小限に抑えることができます

例えば、`TaskRepository`の実装を変更する場合でも、`ITaskRepository`インターフェースを実装する限り、ドメインやユースケース層のコードを変更する必要はありません。

##### 実装例

```typescript
export const createTask = async (
  name: TaskName,
  status: TaskStatusType,
  createdByUserId: UserId
): Promise<void> => {
  await prisma.$transaction(async (tx) => {
    // NOTE: 実装をDIする
    const usecase = new CreateTaskUsecase(new TaskRepository(tx));
    await usecase.execute(name, status, createdByUserId);
  });
};
```

## プロジェクト構造

```
src/
├── domain/      # ドメインモデルとビジネスロジック
├── usecase/     # アプリケーションのユースケース
├── presentation/# APIエンドポイント
└── infra/       # インフラストラクチャの実装
```

### 実装例

各層の役割の例：

```typescript
// Domain層: ドメインモデルとビジネスルール
export class Task {
  private id!: TaskId;
  constructor(
    private name: TaskName,
    private status: TaskStatusType,
    private createdByUserId: UserId,
    private assignedUserId?: UserId
  ) {}
  // ドメインロジック
}

// UseCase層: アプリケーションのユースケース
export class CreateTaskUsecase {
  constructor(private readonly taskRepository: ITaskRepository) {}
  async execute(
    name: TaskName,
    status: TaskStatusType,
    createdByUserId: UserId
  ): Promise<Task> {
    // ユースケースの実装
  }
}

// Presentation層: APIエンドポイント
export const createTask = async (
  name: TaskName,
  status: TaskStatusType,
  createdByUserId: UserId
): Promise<void> => {
  await prisma.$transaction(async (tx) => {
    // NOTE: 実装をDIする
    const usecase = new CreateTaskUsecase(new TaskRepository(tx));
    await usecase.execute(name, status, createdByUserId);
  });
};
```
