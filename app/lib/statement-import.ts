type ImportedStatementEntry = {
  label: string;
  amount: number;
  movementDate: string;
  notes: string;
};

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function parseNumber(value: string) {
  const normalized = value
    .replace(/\s+/g, "")
    .replace(/[R$\u00A0]/g, "")
    .replace(/\.(?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".");

  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : null;
}

function toIsoDate(value: string) {
  const trimmed = value.trim();

  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  }

  const brMatch = /^(\d{2})[\/.-](\d{2})[\/.-](\d{4})$/.exec(trimmed);
  if (brMatch) {
    return `${brMatch[3]}-${brMatch[2]}-${brMatch[1]}`;
  }

  const compactMatch = /^(\d{4})(\d{2})(\d{2})/.exec(trimmed);
  if (compactMatch) {
    return `${compactMatch[1]}-${compactMatch[2]}-${compactMatch[3]}`;
  }

  return null;
}

function parseOfx(content: string) {
  const blocks = content.match(/<STMTTRN>[\s\S]*?<\/STMTTRN>/gi) ?? [];

  return blocks
    .map((block) => {
      const amountMatch = /<TRNAMT>([^<\r\n]+)/i.exec(block);
      const dateMatch = /<DTPOSTED>([^<\r\n]+)/i.exec(block);
      const memoMatch = /<MEMO>([^<\r\n]+)/i.exec(block);
      const nameMatch = /<NAME>([^<\r\n]+)/i.exec(block);
      const fitIdMatch = /<FITID>([^<\r\n]+)/i.exec(block);

      const amount = amountMatch ? parseNumber(amountMatch[1]) : null;
      const movementDate = dateMatch ? toIsoDate(dateMatch[1]) : null;
      const label = normalizeWhitespace(memoMatch?.[1] || nameMatch?.[1] || fitIdMatch?.[1] || "Lancamento importado");

      if (!amount || !movementDate || !label) {
        return null;
      }

      return {
        label,
        amount,
        movementDate,
        notes: "Importado de OFX"
      } satisfies ImportedStatementEntry;
    })
    .filter((entry): entry is ImportedStatementEntry => Boolean(entry));
}

function parseDelimited(content: string) {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return [];
  }

  const separator = [";", ",", "\t"].sort(
    (left, right) => (lines[0].match(new RegExp(`\\${right}`, "g"))?.length ?? 0) - (lines[0].match(new RegExp(`\\${left}`, "g"))?.length ?? 0)
  )[0];

  const rows = lines.map((line) => line.split(separator).map((cell) => normalizeWhitespace(cell.replace(/^"|"$/g, ""))));
  const header = rows[0].map((cell) => cell.toLowerCase());

  const dateIndex = header.findIndex((cell) => ["data", "date", "dt"].includes(cell));
  const labelIndex = header.findIndex((cell) => ["descricao", "descrição", "historico", "histórico", "memo", "descricao lancamento", "lançamento", "label"].includes(cell));
  const amountIndex = header.findIndex((cell) => ["valor", "amount", "valor final"].includes(cell));
  const creditIndex = header.findIndex((cell) => ["credito", "crédito", "entrada", "credit"].includes(cell));
  const debitIndex = header.findIndex((cell) => ["debito", "débito", "saida", "saída", "debit"].includes(cell));

  if (dateIndex === -1 || labelIndex === -1 || (amountIndex === -1 && creditIndex === -1 && debitIndex === -1)) {
    return [];
  }

  return rows
    .slice(1)
    .map((row) => {
      const movementDate = toIsoDate(row[dateIndex] ?? "");
      const label = normalizeWhitespace(row[labelIndex] ?? "");
      let amount: number | null = amountIndex >= 0 ? parseNumber(row[amountIndex] ?? "") : null;

      if (amount === null) {
        const credit = creditIndex >= 0 ? parseNumber(row[creditIndex] ?? "") : null;
        const debit = debitIndex >= 0 ? parseNumber(row[debitIndex] ?? "") : null;

        if (credit !== null && credit !== 0) {
          amount = credit;
        } else if (debit !== null && debit !== 0) {
          amount = debit * -1;
        }
      }

      if (!movementDate || !label || amount === null || amount === 0) {
        return null;
      }

      return {
        label,
        amount,
        movementDate,
        notes: "Importado de extrato"
      } satisfies ImportedStatementEntry;
    })
    .filter((entry): entry is ImportedStatementEntry => Boolean(entry));
}

export function parseStatementDocument(filename: string, content: string) {
  const lower = filename.toLowerCase();
  let entries: ImportedStatementEntry[] = [];

  if (lower.endsWith(".ofx")) {
    entries = parseOfx(content);
  } else {
    entries = parseDelimited(content);
  }

  return entries
    .sort((left, right) => left.movementDate.localeCompare(right.movementDate))
    .map((entry) => ({
      ...entry,
      notes: `${entry.notes}${filename ? ` • ${filename}` : ""}`
    }));
}
