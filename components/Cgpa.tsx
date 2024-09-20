"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

type TabValue = "calculate" | "convert";

export default function CGPAConverter({
  defaultTab = "calculate",
}: {
  defaultTab?: TabValue;
}) {
  const [cgpa, setCGPA] = useState<number | null>(null);
  const [convertedCGPA, setConvertedCGPA] = useState<number | null>(null);
  const [courses, setCourses] = useState<{ grade: string; credits: number }[]>([
    { grade: "", credits: 0 },
  ]);
  const [fromScale, setFromScale] = useState<"4.0" | "5.0">("4.0");
  const [activeTab, setActiveTab] = useState<TabValue>(defaultTab);
  const [showCalculatedResult, setShowCalculatedResult] = useState(false);
  const [showConvertedResult, setShowConvertedResult] = useState(false);

  const calculateCGPA = () => {
    const totalCredits = courses.reduce(
      (sum, course) => sum + course.credits,
      0
    );
    const totalGradePoints = courses.reduce((sum, course) => {
      const gradePoint = getGradePoint(course.grade);
      return sum + gradePoint * course.credits;
    }, 0);
    setCGPA(totalGradePoints / totalCredits);
    setShowCalculatedResult(true);
  };

  const getGradePoint = (grade: string): number => {
    const gradePoints: { [key: string]: number } = {
      A: 4.0,
      "A-": 3.7,
      "B+": 3.3,
      B: 3.0,
      "B-": 2.7,
      "C+": 2.3,
      C: 2.0,
      "C-": 1.7,
      "D+": 1.3,
      D: 1.0,
      F: 0.0,
    };
    return gradePoints[grade.toUpperCase()] || 0;
  };

  const addCourse = () => {
    setCourses([...courses, { grade: "", credits: 0 }]);
  };

  const updateCourse = (
    index: number,
    field: "grade" | "credits",
    value: string | number
  ) => {
    const updatedCourses = [...courses];
    if (field === "credits") {
      value = Math.max(0, Number(value)); // Ensure credits are non-negative
    }
    updatedCourses[index] = { ...updatedCourses[index], [field]: value };
    setCourses(updatedCourses);
  };

  const convertCGPA = () => {
    if (cgpa === null) return;
    if (fromScale === "4.0") {
      setConvertedCGPA((cgpa / 4) * 5);
    } else {
      setConvertedCGPA((cgpa / 5) * 4);
    }
    setShowConvertedResult(true);
  };

  const handleTabChange = (value: TabValue) => {
    setActiveTab(value);
    setShowCalculatedResult(false);
    setShowConvertedResult(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            <div className="flex flex-row justify-center items-center gap-1">
              <h2>FindMyCgpa</h2>
              <Image
                src="icons/graduateCap.svg"
                width={22}
                height={22}
                alt="Logo"
                className="size-6"
              />
            </div>
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Calculate and convert your CGPA with ease
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab as string}
            onValueChange={(value: string) =>
              handleTabChange(value as TabValue)
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="calculate">Calculate CGPA</TabsTrigger>
              <TabsTrigger value="convert">Convert CGPA</TabsTrigger>
            </TabsList>
            <TabsContent value="calculate">
              <div className="space-y-4">
                {courses.map((course, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="flex-1">
                      <Label htmlFor={`grade-${index}`}>Grade</Label>
                      <Input
                        id={`grade-${index}`}
                        value={course.grade}
                        onChange={(e) =>
                          updateCourse(index, "grade", e.target.value)
                        }
                        placeholder="Enter grade (e.g., A, B+, C)"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`credits-${index}`}>Credits</Label>
                      <Input
                        id={`credits-${index}`}
                        type="number"
                        min="0"
                        value={course.credits}
                        onChange={(e) =>
                          updateCourse(index, "credits", e.target.value)
                        }
                        placeholder="Enter credits"
                      />
                    </div>
                  </div>
                ))}
                <Button
                  onClick={addCourse}
                  variant="outline"
                  className="w-full"
                >
                  Add Course
                </Button>
                <Button onClick={calculateCGPA} className="w-full">
                  Calculate CGPA
                </Button>
                {showCalculatedResult && cgpa !== null && (
                  <div className="text-center text-xl font-semibold text-gray-800">
                    Your CGPA: {cgpa.toFixed(2)}
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="convert">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cgpa-input">CGPA</Label>
                  <Input
                    id="cgpa-input"
                    type="number"
                    min="0"
                    max={fromScale === "4.0" ? "4" : "5"}
                    step="0.01"
                    placeholder="Enter your CGPA"
                    onChange={(e) => setCGPA(parseFloat(e.target.value))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="from-scale">From Scale</Label>
                    <Select
                      onValueChange={(value) =>
                        setFromScale(value as "4.0" | "5.0")
                      }
                    >
                      <SelectTrigger id="from-scale">
                        <SelectValue placeholder="Select scale" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4.0">4.0</SelectItem>
                        <SelectItem value="5.0">5.0</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="to-scale">To Scale</Label>
                    <Select disabled>
                      <SelectTrigger id="to-scale">
                        <SelectValue
                          placeholder={fromScale === "4.0" ? "5.0" : "4.0"}
                        />
                      </SelectTrigger>
                    </Select>
                  </div>
                </div>
                <Button onClick={convertCGPA} className="w-full">
                  Convert CGPA
                </Button>
                {showConvertedResult && convertedCGPA !== null && (
                  <div className="text-center text-xl font-semibold text-gray-800">
                    Converted CGPA: {convertedCGPA.toFixed(2)}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
