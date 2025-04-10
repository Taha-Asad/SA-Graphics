// import React, { useState, useEffect } from "react";
// import { Box, Container, LinearProgress, Typography, Grid } from "@mui/material";
// import { useInView } from "react-intersection-observer";

// const skills = [
//   { name: "Corel Draw", percentage: 90 },
//   { name: "Photoshop", percentage: 80 },
//   { name: "Illustrator", percentage: 70 },
//   { name: "InDesign", percentage: 60 },
//   { name: "Figma", percentage: 50 },
// ];

// const SkillBar = ({ skill, isVisible }) => {
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     if (isVisible) {
//       setTimeout(() => setProgress(skill.percentage), 300); // Animate smoothly
//     } else {
//       setProgress(0);
//     }
//   }, [isVisible, skill.percentage]);

//   return (
//     <Grid item xs={12} md={6}>
//       <Box sx={{ mb: 3 }}>
//         <Box display="flex" justifyContent="space-between">
//           <Typography fontWeight={600}>{skill.name}</Typography>
//           <Typography>{progress}%</Typography>
//         </Box>
//         <LinearProgress
//           variant="determinate"
//           value={progress}
//           sx={{
//             height: 8,
//             borderRadius: 4,
//             transition: "width 1.5s ease-in-out",
//             "& .MuiLinearProgress-bar": { backgroundColor: "#149ddd" },
//           }}
//         />
//       </Box>
//     </Grid>
//   );
// };

// const Skill = () => {
//   const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 });

//   return (
//     <Box ref={ref} sx={{ bgcolor: "#F5F5F5", py: 5 }}>
//       <Container>
//         <Typography
//           variant="h3"
//           component="h2"
//           sx={{
//             position: "relative",
//             fontFamily: "Raleway",
//             fontWeight: "500",
//             mb: 4,
//             "&::after": {
//               content: '""',
//               position: "absolute",
//               width: "85px",
//               height: "4px",
//               backgroundColor: "#149ddd",
//               bottom: "-10px",
//               left: "40px",
//               transform: "translateX(-50%)",
//             },
//           }}
//         >
//           Skills
//         </Typography>
//         <Typography variant="body1" color="textSecondary" mb={3}>
//           Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit.
//         </Typography>

//         <Grid container spacing={3}>
//           {skills.map((skill, index) => (
//             <SkillBar key={index} skill={skill} isVisible={inView} />
//           ))}
//         </Grid>
//       </Container>
//     </Box>
//   );
// };

// export default Skill;
