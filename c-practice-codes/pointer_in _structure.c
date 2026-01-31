
#include <stdio.h>
#include <string.h>
struct em
{
     int x;
     char y[99];
};
int main ()
{
     struct em n = {34,"hola"};
     struct em *p = &n;
    printf("confused ? == %d\n",p->x);
    printf("confused ? == %s\n",p->y);

}