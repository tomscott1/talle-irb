// src/pages/carnivals.tsx
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { getCarnivals } from '@/lib/db';
import { Carnival } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type CarnivalsPageProps = {
  carnivals: Carnival[];
};

const CarnivalsPage: React.FC<CarnivalsPageProps> = ({ carnivals }) => {
  return (
    <div className="flex justify-center">
      <div className="w-full md:w-3/4 lg:w-1/2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carnivals.map((carnival) => (
              <TableRow key={carnival.id} className="cursor-pointer">
                <TableCell className="font-medium">
                  <Link href={`/race-day?carnivalId=${carnival.id}`} passHref>
                    {carnival.name}
                  </Link>
                </TableCell>
                <TableCell>{new Date(carnival.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(carnival.endDate).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const carnivals = await getCarnivals();

  const serializedCarnivals = carnivals.map((carnival) => ({
    ...carnival,
    startDate: carnival.startDate.toISOString(),
    endDate: carnival.endDate.toISOString(),
  }));

  return {
    props: {
      carnivals: serializedCarnivals,
    },
  };
};

export default CarnivalsPage;
