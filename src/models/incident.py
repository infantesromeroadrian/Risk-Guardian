from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

class Incident(BaseModel):
    id: Optional[int] = None
    title: str
    description: str
    date_occurred: datetime
    severity: str = Field(..., pattern="^(low|medium|high|critical)$")
    status: str = Field(..., pattern="^(open|investigating|resolved|closed)$")
    impact_type: str
    impact_description: str
    affected_systems: List[str]
    root_cause: Optional[str] = None
    mitigation_actions: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True 