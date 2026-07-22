export interface User {
  userId: number;
  email: string;
  name: string;
  role: 'Admin' | 'Faculty' | 'Student';
}

export interface AuthResponse {
  token: string;
  fullName: string;
  email: string;
  role: string;
  userId: number;
}

export interface Student {
  id: number;
  fullName: string;
  email: string;
  rollNumber: string;
  department: string;
  semester: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth: string;
  enrolledAt: string;
  isActive: boolean;
}

export interface Faculty {
  id: number;
  fullName: string;
  email: string;
  employeeId: string;
  department: string;
  designation: string;
  phoneNumber?: string;
  specialization?: string;
  joinedAt: string;
  courseCount: number;
}

export interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  department: string;
  credits: number;
  semester: string;
  facultyId?: number;
  facultyName?: string;
  isActive: boolean;
  enrolledCount: number;
  createdAt: string;
}

export interface Attendance {
  id: number;
  studentId: number;
  studentName: string;
  rollNumber: string;
  courseId: number;
  courseName: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
  remarks?: string;
  markedAt: string;
}

export interface AttendanceSummary {
  studentId: number;
  studentName: string;
  courseId: string;
  courseName: string;
  totalClasses: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  attendancePercentage: number;
}

export interface Result {
  id: number;
  studentId: number;
  studentName: string;
  rollNumber: string;
  courseId: number;
  courseName: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  examType: string;
  academicYear: string;
  percentage: number;
  createdAt: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalFaculty: number;
  totalCourses: number;
  totalEnrollments: number;
  presentToday: number;
  totalToday: number;
  attendanceRate: number;
  monthlyAttendance: { month: number; year: number; present: number; absent: number }[];
  deptDistribution: { department: string; count: number }[];
  gradeDistribution: { grade: string; count: number }[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
