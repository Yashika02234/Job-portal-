import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';

const AppliedJobTable = () => {
    return (
        <div className='overflow-x-auto'>
            <Table className='min-w-full bg-white border rounded-lg shadow-lg'>
                <TableCaption className='text-gray-500'>A list of your applied jobs</TableCaption>
                <TableHeader>
                    <TableRow className='bg-indigo-100'>
                        <TableHead className='py-3 px-6'>Date</TableHead>
                        <TableHead className='py-3 px-6'>Job Role</TableHead>
                        <TableHead className='py-3 px-6'>Company</TableHead>
                        <TableHead className='py-3 px-6 text-right'>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[1, 2].map((item, index) => (
                        <TableRow key={index} className='border-t hover:bg-indigo-50'>
                            <TableCell className='py-3 px-6'>17-07-204</TableCell>
                            <TableCell className='py-3 px-6'>Front Developer</TableCell>
                            <TableCell className='py-3 px-6'>Google</TableCell>
                            <TableCell className='py-3 px-6 text-right'><Badge className='bg-green-100 text-green-700 px-2 py-1 rounded-full'>Selected</Badge></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default AppliedJobTable;
