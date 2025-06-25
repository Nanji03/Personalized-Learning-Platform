from fastapi import APIRouter, HTTPException
from typing import List, Dict, Optional
from pydantic import BaseModel

router = APIRouter(prefix="/courses", tags=["courses"])

class CourseSection(BaseModel):
    id: int
    title: str
    video_url: Optional[str] = None
    resource_link: Optional[str] = None

class Course(BaseModel):
    id: int
    name: str
    description: str
    sections: List[CourseSection]

# Fixed course catalog
COURSES: Dict[int, Course] = {
    1: Course(
        id=1,
        name="MACHINE LEARNING",
        description="Intro to ML, algorithms, and applications.",
        sections=[
            CourseSection(
                id=1,
                title="Introduction to Machine Learning",
                video_url="https://www.youtube.com/watch?v=GwIo3gDZCVQ"
            ),
            CourseSection(
                id=2,
                title="Supervised Learning Basics",
                video_url="https://www.youtube.com/watch?v=KTeVOb8gaD4"
            ),
            CourseSection(
                id=3,
                title="Unsupervised Learning Overview",
                video_url="https://www.youtube.com/watch?v=3e1GHCA3GP0"
            ),
        ]
    ),
    2: Course(
        id=2,
        name="LANG FRANCAIS: NIVEAU INTERMEDIATE I&II",
        description="Intermediate French language course.",
        sections=[
            CourseSection(
                id=1,
                title="Compréhension orale",
                video_url="https://www.youtube.com/watch?v=example1"
            ),
            CourseSection(
                id=2,
                title="Expression écrite",
                video_url="https://www.youtube.com/watch?v=example2"
            ),
        ]
    ),
    3: Course(
        id=3,
        name="USER INTERFACE DESIGN",
        description="Principles and practices of UI design.",
        sections=[
            CourseSection(
                id=1,
                title="Introduction to UI Design",
                video_url="https://www.youtube.com/watch?v=example3"
            ),
            CourseSection(
                id=2,
                title="User-Centered Design",
                video_url="https://www.youtube.com/watch?v=example4"
            ),
        ]
    ),
    4: Course(
        id=4,
        name="BIG DATA ANALYTICS",
        description="Big data concepts, platforms, and analysis.",
        sections=[
            CourseSection(
                id=1,
                title="What is Big Data?",
                video_url="https://www.youtube.com/watch?v=example5"
            ),
            CourseSection(
                id=2,
                title="Big Data Tools & Platforms",
                video_url="https://www.youtube.com/watch?v=example6"
            ),
        ]
    ),
}

@router.get("/", response_model=List[Course])
def list_courses():
    return list(COURSES.values())

@router.get("/{course_id}", response_model=Course)
def get_course(course_id: int):
    course = COURSES.get(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.get("/{course_id}/section/{section_id}", response_model=CourseSection)
def get_course_section(course_id: int, section_id: int):
    course = COURSES.get(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    section = next((s for s in course.sections if s.id == section_id), None)
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    return section