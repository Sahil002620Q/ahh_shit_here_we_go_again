#include <stdio.h>
int main () {
     int x;
     printf("enter a number :\n");
     scanf("%d",&x);
     if(x%=0){
        printf("given number is composite");
     }else{
        printf("given number is prime");
     }
}