/**
 * Simulates POST /api/scan/submit with malformed payload (curl-equivalent).
 */
import handler from "../api/scan/submit";

type MockRes = {
  statusCode: number;
  headers: Record<string, string>;
  body: unknown;
  status: (code: number) => MockRes;
  json: (payload: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

function createRes(): MockRes {
  const res: MockRes = {
    statusCode: 200,
    headers: {},
    body: null,
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(payload: unknown) {
      res.body = payload;
    },
    setHeader(name: string, value: string) {
      res.headers[name] = value;
    },
  };
  return res;
}

async function run() {
  const cases = [
    {
      name: "empty body",
      req: { method: "POST", body: null, headers: {} },
      expectStatus: 400,
    },
    {
      name: "missing answers",
      req: {
        method: "POST",
        body: { email: "a@b.com", firstName: "A", company: "Co" },
        headers: { "x-forwarded-for": "203.0.113.1" },
      },
      expectStatus: 400,
    },
    {
      name: "invalid q1 option",
      req: {
        method: "POST",
        body: {
          answers: {
            q1: "bogus",
            q2: "seed",
            q3: "founder_ceo",
            q4: "b2b_saas",
            q5: ["support_tickets"],
            q6: "revenue",
            q7: "clone_support",
            q8: "daily",
            q9: "hours_10_40",
            q10: "on_roadmap",
            q11: "not_yet",
            q12: ["nothing_formal"],
            q13: "havent_tried",
            q14: "modern_saas",
            q15: "dedicated_team",
            q16: "documented",
            q17: ["none"],
            q18: "this_quarter",
            q19: "dedicated_budget",
          },
          email: "a@b.com",
          firstName: "A",
          company: "Co",
        },
        headers: { "x-forwarded-for": "203.0.113.2" },
      },
      expectStatus: 400,
    },
  ];

  let failed = 0;
  for (const testCase of cases) {
    const res = createRes();
    await handler(testCase.req, res);
    if (res.statusCode !== testCase.expectStatus) {
      console.error(`✗ ${testCase.name}: expected ${testCase.expectStatus}, got ${res.statusCode}`, res.body);
      failed += 1;
    } else {
      console.log(`✓ ${testCase.name}: HTTP ${res.statusCode}`, res.body);
    }
  }

  process.exit(failed ? 1 : 0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
