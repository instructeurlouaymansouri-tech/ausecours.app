'use client';
import { useState } from 'react';
import { TrainingRegisterPage } from '@/components/AppPages';
export default function Page(){const[ready]=useState(true);return ready?<TrainingRegisterPage/>:null}
