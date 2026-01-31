#include <stdio.h>
int main() {
    int num = 34;
    int *p = &num;
    printf("%d\n", *p);
    int **p2 = &p;    // new pownter headind to the direction of first pointer
 
     **p2 = 23;
    printf("%d",**p2);
}


//     int num = 99;
//     int *(name pointer) = &(enter the variable whose address you want to access);
//     now p = num