#include <stdio.h>
int main () { 
    int num = 2;

    int *p = &num;
    int **p2 = &p;

printf(" num = %d\n",num);
printf(" *p = %d\n",*p);
printf(" **p2 = %d\n",**p2);   
}
