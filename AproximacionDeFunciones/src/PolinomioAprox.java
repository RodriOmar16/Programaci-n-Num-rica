import java.util.Scanner;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class PolinomioAprox {
	public Matriz MatrizInterpolante; //matriz de coef
	public double ListaPtos[][]; //termninos independientes
	public double PolinomioInterpolante[]; 
	public int cantidad;
	
	//Constructor
	public PolinomioAprox(int n) {
		this.cantidad              = n;
		this.MatrizInterpolante    = new Matriz(n,n);
		this.ListaPtos             = new double[n][2];
		this.PolinomioInterpolante = new double[n];
	}
	//GETTERS AND SETTERS
	public int getCantidad() { return this.cantidad; }
	public void setCantidad(int n) { this.cantidad = n; }
	
	public double[][] getListaPtos() { return this.ListaPtos; }
	public void setListaPtos(double l[][], int n, int m) {
		this.cantidad = n;
		this.ListaPtos = new double[n][m];

		for(int i=0; i<n ;i++) {
			for(int j=0; j<m ;j++) {
				this.ListaPtos[i][j] = l[i][j];
			}
		}
	}
	
	public double[] getPolinomioInterpolante() { return this.PolinomioInterpolante; }
	public void setPolinomioInterpolante(double p[]) {
		int n = this.PolinomioInterpolante.length;
		for(int i=0; i<n ;i++) {
			this.PolinomioInterpolante[i] = p[i];
		}
	}
	
	public double[][] getMatriz(){	return this.MatrizInterpolante.getMatrizCoef();  }
	
	//METODOS
	public void cargarPtos(){
		int n = this.cantidad;
		Scanner teclado = new Scanner(System.in);
		for(int i=0; i<n ;i++) {
			for(int j=0; j<2 ;j++) {
				if(j==0) {
					System.out.print("Ingresar coordenada x: ");
				}else System.out.print("Ingresar valor y = f(x): ");
				this.ListaPtos[i][j] = teclado.nextDouble();
			}
		}
	}
	public void mostrarPtos() {
		int n = this.cantidad;
		System.out.print("x | y = f(x)");
		for(int i=0; i<n ;i++) {
			System.out.print("\n----------------\n");	
			for(int j=0; j<2 ;j++) {
				if(j==0) {
					System.out.print(this.ListaPtos[i][j]+" | ");
				}else System.out.print(this.ListaPtos[i][j]);
			}
		}
	}
	//MOSTRAR EL POLINOMIO INTERPOLANTE
	public void mostrarPolinomioInterpolante() {
		String cad = "";
	    int i, n = this.cantidad;;
	    for(i=(n-1);i>=0;i--){
	        if(this.PolinomioInterpolante[i] >= 0){
	            if(i!=(n-1)){
	                cad += "+";
	            }
	        }
	        if(i==0){
	            cad = cad + " "+ this.PolinomioInterpolante[i];
	        }else{
	            if(i==1){
	                if(this.PolinomioInterpolante[i] == 1){
	                    cad += " x ";
	                }else{
	                    if(this.PolinomioInterpolante[i] == -1){
	                        cad += "- x ";
	                    }
	                    else {
	                      cad = cad + " " + this.PolinomioInterpolante[i] + "x ";
	                    }
	                }
	            }else{
	                if(this.PolinomioInterpolante[i] == 1){
	                    cad += " x^"+i+" ";
	                }else{
	                    if(this.PolinomioInterpolante[i] == -1){
	                        cad += "- x^"+i+" ";
	                    }
	                    else cad = cad +" "+ this.PolinomioInterpolante[i] + "x^"+i+" ";
	                }
	            }
	        }
	    }
	    System.out.println("P(x) = "+cad);
	}
	
	//COLOCACION POR VAN DER MONDE
	public void vanDerMonde() {
		int n = this.cantidad;
		double vdm[][] = new double[n][n], ti[][] = new double[n][1], aux[] = new double[n];

		for(int f=0; f<n ;f++) {
			for(int c=0; c<n ;c++) {
				vdm[f][c] = Math.pow(this.ListaPtos[f][0],(n-1-c));
				ti[f][0]  = this.ListaPtos[f][1];
 			}
		}
		this.MatrizInterpolante.setMatrizCoef(vdm, n, n);
		this.MatrizInterpolante.setMatrizTermIndep(ti, n);
		
		this.MatrizInterpolante.mostrarMatriz(3);
		aux = MatrizInterpolante.eliminacionGaussiana();
		
		
		for(int i=0; i<n ;i++) {
			this.PolinomioInterpolante[(n-1-i)] = aux[i];
		}
	}
	
	 // Método para multiplicar dos polinomios
    public List<Double> multiplyPolynomials(List<Double> poly1, List<Double> poly2) {
        int degree1 = poly1.size();
        int degree2 = poly2.size();
        Double[] result = new Double[degree1 + degree2 - 1];
        Arrays.fill(result, 0.0);
        
        for (int i = 0; i < degree1; i++) {
            for (int j = 0; j < degree2; j++) {
                result[i + j] += poly1.get(i) * poly2.get(j);
            }
        }
        
        return Arrays.asList(result);
    }
    // Método para calcular el producto de n binomios (x - xi)
    public List<Double> calculateBinomialProduct(double[] roots) {
        List<Double> poly = new ArrayList<>(Arrays.asList(1.0, -roots[0]));
        
        for (int i = 1; i < roots.length; i++) {
            List<Double> binomial = new ArrayList<>(Arrays.asList(1.0, -roots[i]));
            poly = multiplyPolynomials(poly, binomial);
        }
        
        return poly;
    }
    //COLOCACION POR LAGRANGE
    private double[][] obternerPolinomiosBasicosLgrange() {
		int cant = this.cantidad,
			k;
    	double m[][] = new double[cant][cant],
    			x[]  = new double[cant-1],
    			d    = 1;
    	
    	// Lista de valores xi
    	for(int i=0; i<cant ;i++) {
    		k = 0; d=1;
    		for(int j=0; j<cant ;j++) {
    			if(i!=j) {
    				x[k] = this.ListaPtos[j][0];
    				k++;
    				d *= (this.ListaPtos[i][0] - this.ListaPtos[j][0]);
    			}
    		}
    		// Calcular el producto de los binomios (x - xi)
            List<Double> polynomial = calculateBinomialProduct(x);
            int n = polynomial.size();

            //Divido por la constante
            for(int e=0; e<n ;e++) {
            	polynomial.set(e, polynomial.get(e)/d);
            }
            //Forma la matriz de Polinomios básicos
            for(int c=0; c<cant ;c++) {
            	//this.MatrizInterpolante.setElemento(i, f, polynomial.get(f));
            	m[i][c] = polynomial.get(c);
            }
            //this.MatrizInterpolante.mostrarMatriz(1);
    	}
    	       
        return m;
    }
    private double[] construirMatrizLagrange(double pb[][], int n) {
    	double m[] = new double[n], aux, yM[][] = new double[n][1], pbAux[][] = new double[n][n];
    	Matriz A = new Matriz(n, n), B = new Matriz(3,1); 
    	int f;
    	//Creo una copia de seguridad
    	for(int i=0; i<n ;i++) {
    		for(int j=0; j<n ;j++) {
    			pbAux[i][j] = pb[i][j];
    		}
    	}

    	//Transponer
    	for(f=0; f<n ;f++){
    		for(int c=f; c<n ;c++) {
    			if(f!=c) {
    				aux         = pbAux[f][c];
    				pbAux[f][c] = pbAux[c][f];
    				pbAux[c][f] = aux;
    			}
    		}
    	}
    	
    	//Invertir filas
    	f = 0;
    	while(f<(n-1-f)) {
    		for(int c=0; c<n ;c++) {
    			aux            	  = pbAux[f][c];
    			pbAux[f][c]       = pbAux[(n-1-f)][c];
    			pbAux[(n-1-f)][c] = aux;
     		}
    		f++;
    	}

    	//Formo el matriz yM para el producto Matricial
    	for(int i=0; i<n ;i++) {
    		yM[i][0] = this.ListaPtos[i][1];
    	}
    	
    	A.setMatrizCoef(pbAux, n, n);
    	B.setMatrizCoef(yM, n, 1);
    	yM = A.prodMatricial(A, B);
    	
    	//Tranformo la matriz yM en un vector m, del polinomio
    	for(int i=0; i<n ;i++){
    		m[i] = yM[i][0];
    	}
    	
    	return m;
    }
    private double[] determinarPolinomio(double pb[][], int n) {
    	double m[] = new double[n], pbAux[][] = new double[n][n];
    	
    	//Creo una copia de seguridad
    	for(int i=0; i<n ;i++) {
    		for(int j=0; j<n ;j++) {
    			pbAux[i][j] = pb[i][j];
    		}
    	}
    	//Multiplica cada uno de los polinomios básicos obtenidos por el f(x)
    	for(int i=0; i<n ;i++) {
    		for(int j=0; j<n ;j++) {
    			pbAux[i][j] *= this.ListaPtos[i][1]; 
    		}
    	}
    	//Sumo los coeficientes para obtener el polinomio final
    	for(int j=0; j<n ;j++) {
    		for(int i=0; i<n ;i++) {
    			m[(n-1-j)] += pbAux[i][j];
    		}
    	}
    	return m;    	
    }
    public void lagrange(int opc) {
    	//Determino los polinmios básicos de lagrange
    	int n = this.cantidad;
    	double polBasicosLagrange[][] = new double[n][n];
    	polBasicosLagrange = obternerPolinomiosBasicosLgrange();
    	   	
    	switch(opc) {
    	case 1:
    		this.PolinomioInterpolante = construirMatrizLagrange(polBasicosLagrange, n);  break;
    	case 2: this.PolinomioInterpolante = determinarPolinomio(polBasicosLagrange, n);  break;
    	}
    }

    private double[] diferenciasDivididas() {
    	int n = this.cantidad;
    	double d[] = new double[n], dAux[] = new double[n];
    	
    	//Copio las coordenadas de y = f(x)
    	for(int i=0; i<n ;i++) {
    		d[i] 	= this.ListaPtos[i][1];
    		dAux[i] = this.ListaPtos[i][1];
    		//System.out.println("d["+i+"]: "+d[i]);
    	}
    	
    	//Calculo las diferencias dividas
    	for(int i=0; i<n ;i++) {
    		for(int j=0; j<n ;j++) {
    			d[j] = dAux[j];
    		}
    		for(int j=i; j<(n-1) ;j++) {
    			dAux[j+1] = (d[j+1] - d[j])/(this.ListaPtos[j+1][0] - this.ListaPtos[j-i][0]);
    		}
    	}

    	return dAux;
    }
    
    //COLOCACION POR NEWTON
    public void newton() {
    	int tam = this.cantidad, k=0;
    	double d[] = new double[tam],
    		aux[]  = new double[tam-1],
    		m[][]  = new double[tam][tam];
    	
    	d = diferenciasDivididas();
    	   	
    	m[0][0] = d[0];
    	for(int c=1; c<tam ;c++) {
    		m[0][c] = 0;
    	}
    	
    	for(int i=1; i<tam ;i++) {
    		k=0;
    		//armo los binomios
    		for(int j=0; j<(tam-1) ;j++) {
        		aux[j] = this.ListaPtos[j][0];
        		k++;
        	}
    		for(int j=0; j<k ;j++) {
    			System.out.print(aux[j]+"\t");
    		}
        	// Calcular el producto de los binomios (x - xi)
            List<Double> polynomial = calculateBinomialProduct(aux);
            int n = polynomial.size();

            //Divido por la constante
            for(int e=0; e<n ;e++) {
            	polynomial.set(e, polynomial.get(e)*d[i]);
            }
            //armo la matriz para sumar por columnas
            for(int j=0; j<tam ;j++) {
            	if(j<n) {
            		m[i][j] = polynomial.get(j);
            	}else m[i][j] = 0;
            }          
    	} 
        System.out.println("\nMuestra de la matriz - newton:");
        for(int i=0; i<tam ;i++) {
        	System.out.println("");
        	for(int j=0 ; j<tam ;j++) {
        		System.out.print(m[i][j]+"\t");
        	}
        }
    }
}
