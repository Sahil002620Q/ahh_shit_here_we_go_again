#include <stdio.h>
int main () {
    float n1,n2;
    char opt;
printf("enter value for first number \n");
scanf("%f",&n1);

printf("enter value for second number \n");
scanf("%f",&n2);

printf("enter operator (i.e. enter + , - ,* or /) :\n ");
scanf(" %c",&opt);

switch(opt) {
    
    case '+':
    printf("sum of given two digit is %f ",n1+n2);
    break;    

    case '-':
    printf("sum of given two digit is %f ",n1-n2);
    break;

    case '*':
    printf("sum of given two digit is %f ",n1*n2);
    break;

    case '/':
    if(n2 ==0)
    {
        printf("dividion by 0 is not possible");
    }else
    {printf("sum of given two digit is %f ",n1/n2);
    }
    break;

    default:
    printf("enter valid input");
    break;
}



}