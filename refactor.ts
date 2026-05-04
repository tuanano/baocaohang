import * as fs from 'fs';

const original = fs.readFileSync('src/components/ReportDetail.tsx', 'utf-8');

let pre = original.replace(/export default function ReportDetail\([^)]+\) {/, `export default function CreatePreReportDetail({ category, onBack }: { category: 'quantity' | 'serial', onBack: () => void }) {
  const type = 'pre';
  const mode = 'create';
  const isApproveMode = false;`);
pre = pre.replace(/import \{ useState, useMemo/g, "import { useState, useMemo"); // Just a touch to verify
fs.writeFileSync('src/components/CreatePreReportDetail.tsx', pre);

let post = original.replace(/export default function ReportDetail\([^)]+\) {/, `export default function CreatePostReportDetail({ category, onBack }: { category: 'quantity' | 'serial', onBack: () => void }) {
  const type = 'post';
  const mode = 'create';
  const isApproveMode = false;`);
fs.writeFileSync('src/components/CreatePostReportDetail.tsx', post);

console.log('Files copied successfully.');
