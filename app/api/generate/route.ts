import { NextResponse } from 'next/server';

// 1. Define types for our Mock Database
interface MockResponseMap {
  [key: string]: string;
}

interface MockDatabase {
  [language: string]: MockResponseMap;
}

// 2. Hardcoded "AI" responses
const MOCK_DB: MockDatabase = {
  python: {
    "reverse string": "def reverse_string(s):\n    return s[::-1]\n\n# Usage\nprint(reverse_string('hello'))",
    "hello world": "print('Hello, World!')",
    "fibonacci": "def fib(n):\n    if n <= 1: return n\n    return fib(n-1) + fib(n-2)\n\n# Print first 10 numbers\nfor i in range(10):\n    print(fib(i))",
    "factorial": "def factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n-1)\n\nprint(factorial(5)) # Output: 120",
    "palindrome": "def is_palindrome(s):\n    clean_s = ''.join(c.lower() for c in s if c.isalnum())\n    return clean_s == clean_s[::-1]\n\nprint(is_palindrome('A man, a plan, a canal: Panama'))",
    "sort": "def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr\n\nprint(bubble_sort([64, 34, 25, 12, 22, 11, 90]))",
    "file": "# Write to a file\nwith open('example.txt', 'w') as f:\n    f.write('Hello from Python!')\n\n# Read from a file\nwith open('example.txt', 'r') as f:\n    content = f.read()\n    print(content)",
    "default": "# Python code generated\nimport random\n\ndef main():\n    print(f'Random number: {random.randint(1, 100)}')\n    print('Mini Copilot: Python Logic Ready')\n\nif __name__ == '__main__':\n    main()"
  },
  javascript: {
    "reverse string": "function reverseString(str) {\n  return str.split('').reverse().join('');\n}\n\nconsole.log(reverseString('hello'));",
    "hello world": "console.log('Hello, World!');",
    "factorial": "const factorial = (n) => {\n  if (n === 0 || n === 1) return 1;\n  return n * factorial(n - 1);\n};\n\nconsole.log(factorial(5));",
    "api": "// Fetch data from an API\nasync function getUser(id) {\n  try {\n    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);\n    const data = await response.json();\n    console.log(data);\n  } catch (error) {\n    console.error('Error:', error);\n  }\n}\n\ngetUser(1);",
    "promise": "const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));\n\nwait(1000).then(() => console.log('1 second passed!'));",
    "array": "const numbers = [1, 2, 3, 4, 5];\n\n// Filter even numbers and double them\nconst result = numbers\n  .filter(n => n % 2 === 0)\n  .map(n => n * 2);\n\nconsole.log(result); // [4, 8]",
    "default": "// JavaScript code generated\nconst main = () => {\n  const timestamp = new Date().toISOString();\n  console.log(`[${timestamp}] Mini Copilot: JS Logic Active`);\n};\n\nmain();"
  },
  cpp: {
    "hello world": "#include <iostream>\n\nint main() {\n    std::cout << \"Hello, World!\" << std::endl;\n    return 0;\n}",
    "factorial": "#include <iostream>\nusing namespace std;\n\nint factorial(int n) {\n    if (n == 0) return 1;\n    return n * factorial(n - 1);\n}\n\nint main() {\n    cout << \"Factorial of 5 is: \" << factorial(5) << endl;\n    return 0;\n}",
    "sort": "#include <iostream>\n#include <algorithm>\n#include <vector>\n\nint main() {\n    std::vector<int> v = {4, 2, 5, 3, 1};\n    std::sort(v.begin(), v.end());\n\n    for (int n : v) {\n        std::cout << n << \" \";\n    }\n    return 0;\n}",
    "class": "#include <iostream>\nusing namespace std;\n\nclass Rectangle {\n    int width, height;\n  public:\n    void set_values (int,int);\n    int area() {return width*height;}\n};\n\nvoid Rectangle::set_values (int x, int y) {\n  width = x;\n  height = y;\n}\n\nint main () {\n  Rectangle rect;\n  rect.set_values (3,4);\n  cout << \"area: \" << rect.area() << endl;\n  return 0;\n}",
    "default": "#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string name;\n    cout << \"Enter your name: \";\n    // getline(cin, name); \n    // Mock input for demo\n    name = \"User\";\n    \n    cout << \"Hello \" << name << \" from Mini Copilot C++\" << endl;\n    return 0;\n}"
  },
  java: {
    "hello world": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello Java!\");\n    }\n}",
    "class": "public class Person {\n    private String name;\n    public Person(String name) {\n        this.name = name;\n    }\n    public String getName() {\n        return name;\n    }\n}",
    "default": "public class Copilot {\n    public static void main(String[] args) {\n        System.out.println(\"Java Logic Ready\");\n    }\n}"
  },
  csharp: {
    "hello world": "using System;\nclass Program {\n    static void Main() {\n        Console.WriteLine(\"Hello C#!\");\n    }\n}",
    "linq": "using System;\nusing System.Linq;\nclass Program {\n    static void Main() {\n        int[] numbers = { 1, 2, 3, 4, 5 };\n        var even = numbers.Where(n => n % 2 == 0);\n        foreach (var n in even) Console.WriteLine(n);\n    }\n}",
    "default": "// C# Code\nusing System;\nnamespace CopilotApp {\n    class Program {\n        static void Main(string[] args) {\n            Console.WriteLine(\"C# Ready\");\n        }\n    }\n}"
  },
  go: {
    "hello world": "package main\nimport \"fmt\"\nfunc main() {\n    fmt.Println(\"Hello Go!\")\n}",
    "goroutine": "package main\nimport (\n    \"fmt\"\n    \"time\"\n)\nfunc say(s string) {\n    for i := 0; i < 3; i++ {\n        time.Sleep(100 * time.Millisecond)\n        fmt.Println(s)\n    }\n}\nfunc main() {\n    go say(\"world\")\n    say(\"hello\")\n}",
    "default": "package main\nimport \"fmt\"\nfunc main() {\n    fmt.Println(\"Go Logic Ready\")\n}"
  },
  rust: {
    "hello world": "fn main() {\n    println!(\"Hello Rust!\");\n}",
    "match": "fn main() {\n    let number = 3;\n    match number {\n        1 => println!(\"One\"),\n        2 => println!(\"Two\"),\n        _ => println!(\"Other\"),\n    }\n}",
    "default": "fn main() {\n    let x = 5;\n    println!(\"Rust Logic Ready: {}\", x);\n}"
  }
};

// 3. The API Handler
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, language } = body;

    if (!prompt || !language) {
      return NextResponse.json({ error: 'Missing prompt or language' }, { status: 400 });
    }

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Faster response for better UX

    const langKey = language.toLowerCase();
    const promptKey = prompt.toLowerCase();
    
    let code = MOCK_DB[langKey]?.default || `// No mock data for ${language} yet.`;

    if (MOCK_DB[langKey]) {
      const keys = Object.keys(MOCK_DB[langKey]);
      for (const key of keys) {
        if (promptKey.includes(key) && key !== 'default') {
          code = MOCK_DB[langKey][key];
          break; 
        }
      }
    }

    return NextResponse.json({ code });

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}