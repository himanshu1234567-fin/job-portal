// SoftSkillsPage.tsx
"use client";
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const softSkills = [
  {
    title: "Communication",
    description: "Learn how to express ideas clearly, listen actively, and communicate effectively in teams.",
    tips: ["Practice active listening", "Be clear and concise", "Use positive body language"],
  },
  {
    title: "Teamwork",
    description: "Understand the value of collaboration and how to work productively with others.",
    tips: ["Be open to feedback", "Respect diverse perspectives", "Contribute fairly"],
  },
  // Add more soft skills...
];

const SoftSkillsPage = () => {
  const [progress, setProgress] = useState(40); // e.g., 40% complete

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Prepare for Soft Skills
      </Typography>

      <Typography variant="body1" mb={3}>
        Enhance your communication, teamwork, and leadership to become a well-rounded professional.
      </Typography>

      <Box mb={4}>
        <Typography variant="subtitle1">Your Progress</Typography>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />
      </Box>

      <Grid container spacing={2}>
        {softSkills.map((skill, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{skill.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{skill.description}</Typography>
                <Typography variant="subtitle2" mt={2}>Tips:</Typography>
                <ul>
                  {skill.tips.map((tip, i) => (
                    <li key={i}>
                      <Typography variant="body2">{tip}</Typography>
                    </li>
                  ))}
                </ul>
                <Button variant="outlined" size="small" sx={{ mt: 2 }}>
                  Practice {skill.title}
                </Button>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SoftSkillsPage;
