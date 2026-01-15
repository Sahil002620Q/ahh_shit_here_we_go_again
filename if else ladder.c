#include <stdio.h> 
int main () {
     int x;
     printf("\nenter grade : \n");
     scanf("%d",&x);

     if(x<=30){
        printf("fail");
     }else if(x<=70){
        printf(" B ");
     }else if(x<=80){
        printf(" B+ ");
     }else if(x<=90){
        printf(" A ");
     }else if(x<=100){
        printf(" A+ ");
     }else{
        printf("enter a vailed value ");
     }
     
}