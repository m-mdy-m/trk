import type { ChecklistItem } from "@core/events";
import { uid, today } from "@utils/date";
import { BaseService } from "./base.service";
import { DatabaseException } from "@utils/exception";
import { BUILT_IN_CHECK_LIST } from "@common/constant";

export class ChecklistService extends BaseService {
  init(): void {
    this.on("checklist:daily", () => this.getOrCreate("daily"));
    this.on("checklist:weekly", () => this.getOrCreate("weekly"));
    this.on("checklist:monthly", () => this.getOrCreate("monthly"));
    this.on("checklist:custom", (p) => this.getOrCreate(p.name));
    this.on("checklist:toggle", (p) => this.toggle(p.id));
    this.logger.debug("ChecklistService registered");
  }

  private getOrCreate(listName: string): ChecklistItem[] {
    const date = today();

    const existing = this.query<ChecklistItem>(
      `
        SELECT id, text, done, list_name as listName, date
        FROM checklist_items
        WHERE list_name = ? AND date = ?
        ORDER BY rowid ASC
      `,
      [listName, date],
    );

    if (existing.length > 0) return existing;

    const templates = BUILT_IN_CHECK_LIST[listName] ?? [];
    const items: ChecklistItem[] = templates.map((text) => ({
      id: uid(),
      text,
      done: false,
      listName,
      date,
    }));

    const insertMany = this.transaction((rows: ChecklistItem[]) => {
      const insertSql = `
        INSERT INTO checklist_items (id, text, done, list_name, date)
        VALUES (@id, @text, @done, @listName, @date)
      `;
      for (const row of rows) {
        this.execute(insertSql, { ...row, done: row.done ? 1 : 0 });
      }
    });

    insertMany(items);
    return items;
  }

  private toggle(id: string): ChecklistItem {
    const item = this.get<ChecklistItem>(`SELECT id, text, done, list_name as listName, date FROM checklist_items WHERE id = ?`, [id]);

    if (!item) {
      throw new DatabaseException(`Checklist item not found: ${id}`, {
        code: "DB_NOT_FOUND",
        meta: { id },
      });
    }

    const newDone = item.done ? 0 : 1;
    this.execute(`UPDATE checklist_items SET done = ? WHERE id = ?`, [newDone, id]);

    return { ...item, done: !!newDone };
  }
}
