import { createAccessControl } from "better-auth/plugins/access"
import {
  defaultStatements,
  userAc,
  adminAc,
} from "better-auth/plugins/admin/access"

// デフォルトの権限文でアクセス制御システムの初期化
export const ac = createAccessControl(defaultStatements)

// カスタムユーザーロール
export const user = ac.newRole({
  ...userAc.statements,
  // ユーザー一覧を表示する権限を追加
  user: [...userAc.statements.user, "list"],
})

// 管理者ロール
export const admin = ac.newRole(adminAc.statements)
