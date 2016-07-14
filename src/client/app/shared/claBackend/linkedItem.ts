import { ClaRepo } from './repo';

export abstract class LinkedItem {
  constructor(public id: string, public gist: string) { }

  public abstract getType(): string;
  public abstract getIdObject(): Object;
  public abstract getNameObject(): Object;
  public abstract getCompleteObject(): Object;
}

export class LinkedRepo extends LinkedItem {
  constructor(private repo: ClaRepo) {
    super(repo.repoId, repo.gist);
  }

  public getType(): string {
    return 'repo';
  }
  public getIdObject(): Object {
    return { repoId: this.repo.repoId };
  }
  public getNameObject(): Object {
    return {
      repo: this.repo.repo,
      user: this.repo.owner
    };
  }
  public getCompleteObject(): ClaRepo {
    return this.repo;
  }
}
