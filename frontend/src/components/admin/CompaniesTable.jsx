
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal } from 'lucide-react'

const CompaniesTable = () => {
    return (
        <div>
            <Table>
                <TableCaption>A list of your recent registered companies</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Logo</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableCell>
                        <Avatar>
                            <AvatarImage src="https://www.google.com/imgres?q=logo&imgurl=https%3A%2F%2Fwww.logoai.com%2Fuploads%2Foutput%2F2025%2F03%2F02%2Ffa93a8ba1c637267c574643c934c9ca4.jpg&imgrefurl=https%3A%2F%2Fwww.logoai.com%2F&docid=_j5Q7DOY7TFxeM&tbnid=B2LIzTq9FKfgtM&vet=12ahUKEwjE-ba-xbyMAxUoM9AFHYw2BckQM3oECHcQAA..i&w=2400&h=1800&hcb=2&itg=1&ved=2ahUKEwjE-ba-xbyMAxUoM9AFHYw2BckQM3oECHcQAA" />
                        </Avatar>
                    </TableCell>
                    <TableCell>company Name</TableCell>
                    <TableCell>18-07-2024</TableCell>
                    <TableCell className="text-right cursor-pointer">
                        <Popover>
                            <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                            <PopoverContent className="w-32">
                                <div onClick={() => navigate(`/admin/companies/${company._id}`)} className='flex items-center gap-2 w-fit cursor-pointer'>
                                    <Edit2 className='w-4' />
                                    <span>Edit</span>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </TableCell>
                </TableBody>
            </Table>
        </div>
    )
}

export default CompaniesTable