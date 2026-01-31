#include <stdio.h>
void calc(int x, int y){
    int sum = x + y ;
    printf("sum of %d and %d is %d\n",x,y,sum);
}
int main () {
    calc(3, 5);
    calc(7, 3);

 
}