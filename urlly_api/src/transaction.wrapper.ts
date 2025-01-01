type RetryWrapperOptions = {
  retryAttempts: number;
};

class MaxRetryAttemptsError extends Error {
  constructor(cause?: Error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    super('Max retry attempts reached', { cause });
  }
  public readonly code: string = MaxRetryAttemptsError.name;
}

export class RetryWrapper<TResponse> {
  private defaultOptions: RetryWrapperOptions = {
    retryAttempts: 3,
  };
  private options: RetryWrapperOptions;

  constructor(
    private readonly fn: () => Promise<TResponse>,
    options?: RetryWrapperOptions,
  ) {
    this.options = {
      ...this.defaultOptions,
      ...(options ?? {}),
    };
  }

  public async execute(): Promise<TResponse> | never {
    let attempts = 0;
    while (attempts < this.options.retryAttempts) {
      try {
        return await this.fn();
      } catch (error) {
        attempts++;
        if (attempts === this.options.retryAttempts) {
          throw new MaxRetryAttemptsError(error);
        }
      }
    }

    throw new MaxRetryAttemptsError();
  }
}
