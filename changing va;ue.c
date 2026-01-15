#include <stdio.h>
int main() {
    int num = 34;
    int *p = &num;
    int **p2 = &p;
 
     **p2 = 23;
    printf("%d",**p2);
}