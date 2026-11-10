import type { ProblemFormValues } from "../schema";

export const sampleProblem: ProblemFormValues = {
  title: "Fibonacci Number",
  description: `Given an integer n, return the nth Fibonacci number.

The Fibonacci sequence is defined as:
- F(0) = 0
- F(1) = 1
- F(n) = F(n - 1) + F(n - 2), for n > 1.

Implement an efficient solution using Dynamic Programming.`,
  difficulty: "Easy",
  tags: ["Dynamic Programming", "Math", "Recursion"],
  constraints: `0 <= n <= 30`,
  hints: `1. Consider the base cases F(0) and F(1).
2. Each Fibonacci number depends on the previous two numbers.
3. Use two variables to optimize space complexity.`,
  editorial: `Use an iterative Dynamic Programming approach.

Maintain two variables representing the previous two Fibonacci numbers. Iterate from 2 to n, calculating the current Fibonacci number as their sum.

Time Complexity: O(n)
Space Complexity: O(1)`,
  testCases: [
    { input: "2", output: "1" },
    { input: "3", output: "2" },
    { input: "4", output: "3" },
    { input: "10", output: "55" },
  ],
  examples: {
    CPP: {
      input: "n = 4",
      output: "3",
      explanation: "F(4) = F(3) + F(2) = 2 + 1 = 3.",
    },
    PYTHON: {
      input: "n = 4",
      output: "3",
      explanation: "F(4) = F(3) + F(2) = 2 + 1 = 3.",
    },
    JAVA: {
      input: "n = 4",
      output: "3",
      explanation: "F(4) = F(3) + F(2) = 2 + 1 = 3.",
    },
  },
  codeSnippets: {
    CPP: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;

    // Write your solution here

    return 0;
}`,
    PYTHON: `def fib(n):
    # Write your solution here
    pass`,
    JAVA: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();

        // Write your solution here
    }
}`,
  },
  referenceSolutions: {
    CPP: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;

    if (n <= 1) {
        cout << n << endl;
        return 0;
    }

    int prev = 0;
    int curr = 1;

    for (int i = 2; i <= n; i++) {
        int next = prev + curr;
        prev = curr;
        curr = next;
    }

    cout << curr << endl;

    return 0;
}`,
    PYTHON: `def fib(n):
    if n <= 1:
        return n

    prev, curr = 0, 1

    for i in range(2, n + 1):
        prev, curr = curr, prev + curr

    return curr

n = int(input())
print(fib(n))`,
    JAVA: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();

        if (n <= 1) {
            System.out.println(n);
            return;
        }

        int prev = 0;
        int curr = 1;

        for (int i = 2; i <= n; i++) {
            int next = prev + curr;
            prev = curr;
            curr = next;
        }

        System.out.println(curr);
    }
}`,
  },
};
