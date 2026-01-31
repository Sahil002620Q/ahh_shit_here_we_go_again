#include <stdio.h>
int main ()
{
    int x = 10;
    int *y = &x;
    printf("x = %d\n",x);
    printf("y = %d\n",*y);
    printf("address = %u\n",&x);
    printf("address = %u\n",y);
    printf("address = %u\n",10);
}


