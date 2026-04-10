import { useState, useCallback, useRef, useEffect } from "react";
import CodeEditorPanel from "@/components/CodeEditorPanel";
import ReviewPanel from "@/components/ReviewPanel";
import RewardDashboard from "@/components/RewardDashboard";
import ExplanationPanel from "@/components/ExplanationPanel";
import HeaderBar from "@/components/HeaderBar";
import { type ReviewAction, type Episode } from "@/lib/rl-agent";
import { toast } from "sonner";

const SAMPLE_CODE: Record<string, string> = {
  python: `def calculate_average(numbers):
    total = 0
    for i in range(len(numbers)):
        total += numbers[i]
    avg = total / len(numbers)
    print avg
    return avg

result = calculate_average([10, 20, 30])
if result = 20:
    print("Average is 20")`,
  javascript: `function findMax(arr) {
  var max = arr[0];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i]
    }
  }
  // TODO: handle empty arrays
  return max;
}

console.log(findMax([3, 1, 4, 1, 5, 9, 2, 6]))`,
  typescript: `interface User {
  name: string;
  age: any;
}

function greetUser(user: User) {
  var greeting = "Hello, " + user.name;
  if (user.age = 18) {
    greeting += " (adult)";
  }
  console.log(greeting)
  return greeting;
}

const user = { name: "Alice", age: 25 };
greetUser(user);`,
  cpp: `#include <iostream>
#include stdio.h

int main() {
    int* arr = new int[10];
    for (int i = 0; i <= 10; i++) {
        arr[i] = i * 2;;
    }
    
    int* ptr = malloc(sizeof(int) * 5);
    
    cout << "Done" << endl;
    return 0;
}`,
  c: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int arr[5];
    for (int i = 0; i <= 5; i++) {
        arr[i] = i * 10;
    }
    
    char* str = malloc(10);
    strcpy(str, "Hello World!!");
    printf("%s\\n", str);
    // TODO: free memory
    return 0;
}`,
  java: `public class Calculator {
    public static double divide(int a, int b) {
        double result = a / b;
        return result;
    }

    public static void main(String[] args) {
        System.out.println(divide(10, 3));
        System.out.println(divide(5, 0));
        
        String s1 = new String("hello");
        String s2 = new String("hello");
        if (s1 == s2) {
            System.out.println("Equal");
        }
    }
}`,
  csharp: `using System;
using System.Collections.Generic;

class Program {
    static void Main() {
        List<int> numbers = new List<int>() { 1, 2, 3, 4, 5 };
        
        for (int i = 0; i <= numbers.Count; i++) {
            Console.WriteLine(numbers[i]);
        }
        
        string input = Console.ReadLine();
        int parsed = int.Parse(input);
        // TODO: handle null input
        Console.WriteLine(parsed * 2);
    }
}`,
  go: `package main

import "fmt"

func findAverage(nums []int) float64 {
    sum := 0
    for i := 0; i <= len(nums); i++ {
        sum += nums[i]
    }
    return float64(sum) / float64(len(nums))
}

func main() {
    numbers := []int{10, 20, 30, 40}
    fmt.Println(findAverage(numbers))
    
    var ptr *int
    fmt.Println(*ptr)
}`,
  rust: `fn main() {
    let mut v = vec![1, 2, 3, 4, 5];
    
    for i in 0..=v.len() {
        println!("{}", v[i]);
    }
    
    let s1 = String::from("hello");
    let s2 = s1;
    // println!("{}", s1); // use after move
    
    let x: i32 = "not a number".parse().unwrap();
    println!("{}", x);
}`,
  ruby: `def calculate_total(items)
  total = 0
  items.each do |item|
    total =+ item[:price]
  end
  total
end

items = [
  { name: "Apple", price: 1.5 },
  { name: "Banana", price: 0.75 },
]

puts calculate_total(items)
puts items[10].name`,
  php: `<?php
function getUserData($id) {
    $query = "SELECT * FROM users WHERE id = " . $id;
    $result = mysql_query($query);
    
    $user = mysql_fetch_array($result);
    echo $user['name'];
    
    if ($user['role'] == 'admin') {
        // TODO: check permissions
    }
    
    return $user;
}

$data = getUserData($_GET['id']);
?>`,
  swift: `import Foundation

class UserManager {
    var users: [String] = []
    
    func addUser(_ name: String) {
        users.append(name)
    }
    
    func getUser(at index: Int) -> String {
        return users[index] // no bounds check
    }
    
    func findUser(_ name: String) -> Int {
        for i in 0...users.count {
            if users[i] == name {
                return i
            }
        }
        return -1
    }
}`,
  kotlin: `fun processData(items: List<String?>): List<String> {
    val results = mutableListOf<String>()
    
    for (i in 0..items.size) {
        val item = items[i]
        results.add(item!!.uppercase())
    }
    
    var total = 0
    items.forEach { 
        total = total + it!!.length 
    }
    
    println("Total length: $total")
    return results
}`,
  scala: `object Main extends App {
  def divide(a: Int, b: Int): Double = {
    a / b
  }
  
  val numbers = List(1, 2, 3, 4, 5)
  var sum = 0
  for (i <- 0 to numbers.length) {
    sum += numbers(i)
  }
  
  println(divide(10, 3))
  println(divide(5, 0))
}`,
  r: `calculate_stats <- function(data) {
  mean_val = mean(data)
  sd_val = sd(data)
  
  for (i in 1:length(data) + 1) {
    if (data[i] = mean_val) {
      print(paste("Found mean at index", i))
    }
  }
  
  result = c(mean_val, sd_val)
  return(result)
}

data <- c(10, 20, 30, NA, 50)
calculate_stats(data)`,
  sql: `SELECT * FROM users 
WHERE name = '' OR 1=1 --';

UPDATE accounts 
SET balance = balance - 100 
WHERE user_id = 42;

SELECT u.name, COUNT(*) 
FROM users u, orders o 
WHERE u.id = o.user_id;

DELETE FROM logs;`,
  html: `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <div onclick="alert(document.cookie)">Click me</div>
  <img src="photo.jpg">
  <input type="password" autocomplete="on">
  <form action="http://example.com/submit">
    <input type="text" name="username">
    <button>Submit</button>
  </form>
  <script>eval(location.hash.slice(1))</script>
</body>
</html>`,
  css: `body {
  font-size: 12px;
  color: red !important;
}

.container {
  width: 100%;
  padding: 10px;
  margin: 0 auto;
}

#header {
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
}

div > div > div > div > span {
  color: blue !important;
}`,
  shell: `#!/bin/bash
rm -rf /
cd $UNSET_VAR
eval "$USER_INPUT"

for f in $(ls *.txt); do
    cat $f | grep "pattern" | wc -l
done

password="admin123"
curl -k https://api.example.com/data?key=$password`,
  lua: `function factorial(n)
    if n = 0 then
        return 1
    end
    return n * factorial(n - 1)
end

local arr = {1, 2, 3, 4, 5}
for i = 0, #arr do
    print(arr[i])
end

print(factorial(10))
print(10 / 0)`,
  dart: `class UserService {
  List<String> users = [];
  
  void addUser(String name) {
    users.add(name);
  }
  
  String getUser(int index) {
    return users[index]; // no bounds check
  }
  
  Future<void> fetchData() async {
    var response = await http.get('http://api.example.com/data');
    var data = jsonDecode(response.body);
    print(data['name']);
    // TODO: error handling
  }
}`,
  haskell: `module Main where

factorial :: Int -> Int
factorial 0 = 1
factorial n = n * factorial (n - 1)

average :: [Int] -> Double
average xs = fromIntegral (sum xs) / fromIntegral (length xs)

main :: IO ()
main = do
  print (factorial (-1))
  print (average [])
  let result = head []
  print result`,
  perl: `#!/usr/bin/perl
use strict;

my @numbers = (1, 2, 3, 4, 5);
for my $i (0..$#numbers + 1) {
    print $numbers[$i];
}

my $input = <STDIN>;
system("echo $input");

open(FILE, "data.txt");
while (<FILE>) {
    print;
}
# TODO: close file handle`,
  elixir: `defmodule Calculator do
  def divide(a, b) do
    a / b
  end
  
  def process_list(list) do
    Enum.map(list, fn item ->
      item * 2
    end)
  end
end

IO.puts Calculator.divide(10, 0)
IO.inspect Calculator.process_list(nil)`,
};

const Index = () => {
  useEffect(() => {
    document.title = "CodeReview AI";
  }, []);

  const [code, setCode] = useState(SAMPLE_CODE.python);
  const [actions, setActions] = useState<ReviewAction[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [language, setLanguage] = useState<"python" | "javascript">("python");
  const [isReviewing, setIsReviewing] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ReviewAction | null>(null);
  const [explanation, setExplanation] = useState("");
  const [isExplaining, setIsExplaining] = useState(false);
  const [stats, setStats] = useState({ totalEpisodes: 0, avgReward: 0, epsilon: 1.0, qTableSize: 1 });

  const handleLanguageChange = useCallback((lang: string) => {
    setCode(SAMPLE_CODE[lang as keyof typeof SAMPLE_CODE] || "");
    setLanguage(lang as "python" | "javascript");
    setActions([]);
    setSelectedAction(null);
    setExplanation("");
  }, []);

  const handleResetTask = useCallback(async (taskId: string) => {
    setIsReviewing(true);
    try {
      const resp = await fetch(`/reset?task_id=${taskId}`, { method: "POST" });
      if (!resp.ok) throw new Error("Reset Failed");
      const data = await resp.json();
      setCode(data.code);
      setLanguage(data.language); // Update highlighting
      setActions([]);
      setEpisodes([]);
      setStats((prev) => ({ ...prev, totalEpisodes: 0, avgReward: 0 }));
      toast.success(`Task ${taskId} initialized`);
    } catch (e) {
      toast.error("Failed to reset task");
    } finally {
      setIsReviewing(false);
    }
  }, []);

  const handleReview = useCallback(async () => {
    setIsReviewing(true);
    setSelectedAction(null);
    setExplanation("");

    try {
      const resp = await fetch("/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action_type: "suggest_fix", content: code }),
      });
      if (!resp.ok) throw new Error("Step Failed");
      
      const data = await resp.json();
      
      // We need to fetch the state/reward after the step
      const stateResp = await fetch("/state");
      const stateData = await stateResp.json();
      const lastTransition = stateData.history[stateData.history.length - 1];
      const reward = lastTransition.reward;
      
      const newAction: ReviewAction = {
        type: "openenv_diagnosis",
        label: `Step ${data.step_count}`,
        description: reward.reason,
        confidence: 1.0,
        severity: reward.value >= 0.8 ? "success" : "warning",
        reward: reward.value,
        details: reward.reason
      };
      
      setActions((prev) => [...prev, newAction]);
      
      const newEpisode: Episode = {
        id: episodes.length + 1,
        reward: reward.value,
        totalReward: reward.value + (episodes.length > 0 ? episodes[episodes.length - 1].totalReward : 0)
      };
      
      const nextEpisodes = [...episodes, newEpisode].slice(-100);
      setEpisodes(nextEpisodes);
      setStats({
        totalEpisodes: nextEpisodes.length,
        avgReward: Number((nextEpisodes.reduce((a, b) => a + b.reward, 0) / nextEpisodes.length).toFixed(2)),
        epsilon: 0, // No epsilon in this deterministic version
        qTableSize: 3 // We have 3 tasks
      });
      
      if (reward.done) {
        toast.success(`Episode complete — Final Reward: ${reward.value.toFixed(2)}`);
      } else {
        toast.info(`Step ${data.step_count} processed. Keep going!`);
      }
    } catch (e) {
      toast.error("Failed to connect to backend.");
      console.error(e);
    } finally {
      setIsReviewing(false);
    }
  }, [code, episodes]);

  const handleExplain = useCallback((action: ReviewAction) => {
    setSelectedAction(action);
    setExplanation("");
    setIsExplaining(true);
    
    // Simulate streaming for the already attached explanation text
    const text = action.details || "";
    let i = 0;
    const interval = setInterval(() => {
      setExplanation((prev) => prev + (text[i] || ""));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setIsExplaining(false);
      }
    }, 10);
  }, []);

  const handleTrainBatch = useCallback(() => {
    toast.error("Offline training is running in Python terminal via train.py");
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <HeaderBar 
        stats={stats} 
        onTrainBatch={handleTrainBatch} 
        onResetTask={handleResetTask} 
        language={language}
        onLanguageChange={(lang) => {
          setLanguage(lang);
          // Auto-reset to first task of that language
          handleResetTask(lang === "python" ? "task_1" : "js_task_1");
        }}
        isTraining={isReviewing} 
      />
      <main className="flex flex-1 gap-3 p-3 pt-0">
        {/* Left: Code Editor */}
        <div className="flex w-1/2 flex-col gap-3">
          <CodeEditorPanel
            code={code}
            language={language}
            onCodeChange={setCode}
            onLanguageChange={handleLanguageChange}
            onReview={handleReview}
            isReviewing={isReviewing}
          />
          <RewardDashboard episodes={episodes} stats={stats} />
        </div>
        {/* Right: Review + Explanation */}
        <div className="flex w-1/2 flex-col gap-3">
          <ReviewPanel
            actions={actions}
            isReviewing={isReviewing}
            selectedAction={selectedAction}
            onExplain={handleExplain}
          />
          <ExplanationPanel
            explanation={explanation}
            isExplaining={isExplaining}
            selectedAction={selectedAction}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
